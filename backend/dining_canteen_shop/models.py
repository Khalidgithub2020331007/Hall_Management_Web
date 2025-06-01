import contextlib
from django.db import models
from django.db.models import Avg
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from registration.models import *
from choices import *


# =====================
#  HallOutlet MODEL
# =====================

class HallOutlet(models.Model):
    owner = models.ForeignKey(Dining_Shop_Canteen, on_delete=models.CASCADE)

    # For dining/canteen
    breakfast_start = models.TimeField(null=True, blank=True)
    breakfast_end = models.TimeField(null=True, blank=True)
    lunch_start = models.TimeField(null=True, blank=True)
    lunch_end = models.TimeField(null=True, blank=True)
    dinner_start = models.TimeField(null=True, blank=True)
    dinner_end = models.TimeField(null=True, blank=True)

    # For shop
    shop_open_time = models.TimeField(null=True, blank=True)
    shop_close_time = models.TimeField(null=True, blank=True)

    rating = models.JSONField(null=True, blank=True, default=dict)
    feedback = models.JSONField(null=True, blank=True, default=dict)

    shop_items = models.JSONField(null=True, blank=True)
    breakfast_items = models.JSONField(null=True, blank=True)
    lunch_items = models.JSONField(null=True, blank=True)
    dinner_items = models.JSONField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    def clean(self):
        role = getattr(self.owner, 'role', None)

        # Dining or Canteen must fill meal times
        if role in ['dining', 'canteen']:

            meal_time_fields = ['breakfast_start', 'breakfast_end', 'lunch_start', 'lunch_end', 'dinner_start', 'dinner_end']
            if missing := [
                field
                for field in meal_time_fields
                if getattr(self, field) in [None, '']
            ]:
                raise ValidationError({field: f"{field.replace('_', ' ').capitalize()} is required for role '{role}'." for field in missing})

        elif role == 'shop':
            if not self.shop_open_time:
                raise ValidationError({'shop_open_time': "Shop open time is required for role 'shop'."})
            if not self.shop_close_time:
                raise ValidationError({'shop_close_time': "Shop close time is required for role 'shop'."})


    def __str__(self):
        return f"Hall: {self.owner.hall} | Outlet: {self.owner.official_role} | Owner: {self.owner.name}"



class AddItem(models.Model):
    id = models.AutoField(primary_key=True)
    
    owner = models.ForeignKey(Dining_Shop_Canteen, on_delete=models.CASCADE)
    
    meal_time = models.CharField(
        max_length=20,
        choices=MEAL_TIME_CHOICES,
        default='breakfast',
        null=True, blank=True 
    )
    
    item= models.CharField(max_length=100)
    
    price = models.DecimalField(max_digits=6, decimal_places=2,validators=[MinValueValidator(0)])

    def clean(self):
        role = self.owner.role.lower()
        if role in ['dining', 'canteen'] and not self.meal_time:
            raise ValidationError("Meal time is required for dining or canteen owners.")
        elif role == 'shop':
            self.meal_time = None  # clear it just in case

    def save(self, *args, **kwargs):
        self.full_clean()  # calls clean()

        super().save(*args, **kwargs)  # save item first

        # Add item to HallOutlet JSONField
        role = self.owner.role.lower()
        if role in ['dining', 'canteen'] and self.meal_time:
            with contextlib.suppress(HallOutlet.DoesNotExist):
                outlet = HallOutlet.objects.get(owner=self.owner)
                field_map = {
                    'breakfast': 'breakfast_items',
                    'lunch': 'lunch_items',
                    'dinner': 'dinner_items'
                }
                if field_name := field_map.get(self.meal_time.lower()):
                    current_items = getattr(outlet, field_name) or []
                    current_items.append({'item': self.item, 'price': float(self.price)})
                    setattr(outlet, field_name, current_items)
                    outlet.save()

    def __str__(self):
        return f"{self.item} - {self.meal_time or 'N/A'} - {self.owner.name}"
    

class Feedback(models.Model):
    id = models.AutoField(primary_key=True)

    item = models.ForeignKey(AddItem, on_delete=models.CASCADE, related_name='feedbacks')    
    user = models.ForeignKey(Student, on_delete=models.CASCADE)

    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating within 1-5"
    )

    review = models.TextField()

    def __str__(self):
        return f"Feedback by {self.user.name} for {self.item.item} (Owner: {self.item.owner.name})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Save feedback first
        self.update_hall_outlet_rating_feedback()

    def update_hall_outlet_rating_feedback(self):
        add_item = self.item
        try:
            hall_outlet = HallOutlet.objects.get(owner=add_item.owner)
        except HallOutlet.DoesNotExist:
            return  # Prevent crash if outlet not found

        # 1. Calculate average rating
        avg_rating = Feedback.objects.filter(item=add_item).aggregate(avg=Avg('rating'))['avg'] or 0.0
        avg_rating = round(avg_rating, 2)
        

        hall_rating = hall_outlet.rating or {}
        hall_rating[str(add_item.id)] = avg_rating

        # 2. Append review
        hall_feedback = hall_outlet.feedback or {}
        reviews_list = hall_feedback.get(str(add_item.id), [])
        reviews_list.append(self.review)
        hall_feedback[str(add_item.id)] = reviews_list

        # 3. Save changes
        hall_outlet.rating = hall_rating
        hall_outlet.feedback = hall_feedback
        hall_outlet.save()

