# =====================
# Official models.py
# =====================

from django.db import models
from halls_and_rooms.models import *
from choices import *
from django.core.exceptions import ValidationError 
from django.db import transaction
import string
import random
from user_info.models import UserInformation

class ProvostBody(models.Model):
    email = models.EmailField("Official Email", unique=True)
    name = models.CharField(max_length=100)
    
    provost_body_role = models.CharField(
        max_length=100,
        choices=PROVOST_BODY_ROLE,
        default='provost'
    )

    department = models.CharField(max_length=100, default='')

    department_role = models.CharField(
        max_length=100,
        choices=DEPARTMENT_ROLE,
        default='professor'
    )

    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)

    priority = models.PositiveIntegerField(default=99, editable=False)

    def __str__(self):
        return self.name

    def get_priority(self):
        role_order = {
            'provost': 1,
            'assistant_provost': 2,
            'professor': 3,
            'associate_professor': 4,
            'assistant_professor': 5,
            'lecturer': 6,
        }

        # Check provost_body_role first
        if self.provost_body_role in role_order:
            return role_order[self.provost_body_role]
        elif self.department_role in role_order:
            return role_order[self.department_role]
        else:
            return 99

    def save(self, *args, **kwargs):
        self.priority = self.get_priority()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['priority', 'name']

    


# =====================
# Official Person Model
# =====================
class OfficialPerson(models.Model):
    email = models.EmailField(unique=True)
    name=models.CharField(max_length=100,default='')
    official_role = models.CharField(max_length=100,choices=OFFICE_PERSON_ROLE,default='Electrician')
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE,default="")


    def __str__(self):
        return self.email


# =====================
# Dining/Shop/Canteen Model
# =====================
class Dining_Shop_Canteen(models.Model):
    email = models.EmailField("Official Email",unique=True)  # Usually, email should be unique
    name=models.CharField(max_length=100)
    official_role = models.CharField(max_length=100,choices=OFFICE_PERSON_ROLE,default='Electrician')

    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)



    def __str__(self):
        return f"{self.name} ({self.email}) - {self.official_role} [Hall ID: {self.hall}]"


# =====================
# Add Office Model
# =====================
class AddOffice(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    password = models.CharField(max_length=100, editable=False)
    blood_group = models.CharField(max_length=100, choices=BLOOD_GROUP_CHOICES)
    hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)
    user_role = models.CharField(max_length=100, choices=USER_ROLE)

    provost_body_role = models.CharField(
        max_length=100,
        choices=PROVOST_BODY_ROLE,
        blank=True, null=True,
        help_text='Only for Provost Body'
    )

    department = models.CharField(max_length=100, blank=True, null=True)
    department_role = models.CharField(
        max_length=100,
        choices=DEPARTMENT_ROLE,
        blank=True, null=True,
        help_text='Only for Provost Body'
    )

    official_role = models.CharField(
        max_length=100,
        choices=OFFICE_PERSON_ROLE,
        default='Assistant Register',
        blank=True, null=True,
        help_text='Only for Official Person or Dining/Shop/Canteen'
    )

    profile_picture = models.ImageField(upload_to='student_profile_pictures/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.email}"


    def clean(self):
        if not self.user_role:
            raise ValidationError("User role must be provided.")
    
        if self.user_role == 'provost_body':
            if not self.provost_body_role or not self.department_role or not self.department:
                raise ValidationError("Provost body role, department role, and department must be provided for provost body.")
    
        elif self.user_role == 'official_person':
            if not self.official_role:
                raise ValidationError({'official_role': 'Official role must be selected for official person.'})
    
        elif self.user_role == 'dining_shop_canteen':
            if self.official_role not in ['dining', 'shop', 'canteen']:
                raise ValidationError({'official_role': 'Role must be either dining, shop, or canteen.'})

    def save(self, *args, **kwargs):
        self.full_clean()
        if not self.password:
            self.password = self.generate_random_password()

        super().save(*args, **kwargs)

        with transaction.atomic():
            # Create or update UserInformation
            UserInformation.objects.update_or_create(
                email=self.email,
                defaults={
                    'name': self.name,
                    'image': self.profile_picture,
                    'phone_number': self.phone_number,
                    'password': self.password,
                    'blood_group': self.blood_group,
                    'hall': self.hall,
                    'user_role': self.user_role,
                }
            )

            if self.user_role == 'provost_body':
                ProvostBody.objects.update_or_create(
                    email=self.email,
                    defaults={
                        'name': self.name,
                        'provost_body_role': self.provost_body_role,
                        'department_role': self.department_role,
                        'department': self.department,
                        'hall': self.hall
                    }
                )

            elif self.user_role == 'official_person':
                OfficialPerson.objects.update_or_create(
                    email=self.email,
                    defaults={
                        'name': self.name,
                        'official_role': self.official_role,
                        'hall': self.hall
                    }
                )

            elif self.user_role == 'dining_shop_canteen':
                Dining_Shop_Canteen.objects.update_or_create(
                    email=self.email,
                    defaults={
                        'name': self.name,
                        'official_role': self.official_role,
                        'hall': self.hall
                    }
                )

        # ❌ self.delete() was here — removed because it deletes the AddOffice record.

    @staticmethod
    def generate_random_password(length=8):
        characters = string.ascii_letters + string.digits
        return ''.join(random.choices(characters, k=length))
