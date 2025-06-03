# =================
# lost_and_found models.py
# =================

from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from registration.models import UserInformation
from django.core.validators import RegexValidator

class New_LostAndFound(models.Model):
    post_id = models.AutoField(primary_key=True)
    post_date_time = models.DateTimeField(auto_now_add=True)

    element_name = models.CharField(max_length=255)
    element_description = models.TextField()
    found_location = models.TextField()
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    image = models.ImageField(upload_to='lost_and_found/', blank=True, null=True)
    user_email = models.ForeignKey(
        UserInformation,
        on_delete=models.CASCADE,
        related_name='lost_and_found_posts'
    )

    def __str__(self):
        return f"{self.element_name} - {self.posted_by.email} ({self.post_date_time.strftime('%Y-%m-%d')})"
    def clean(self):
        # Strip whitespace and validate element name
        if not self.element_name.strip():
            raise ValidationError({'element_name': "Element name cannot be empty or just whitespace."})

        # Ensure at least one contact method is provided
        if not self.contact_number and not self.user_email.email:
            raise ValidationError("At least one contact method (phone or email) must be provided.")

        # Optional: validate contact number format using regex
        if self.contact_number:
            validator = RegexValidator(r'^\+?\d{7,15}$', "Enter a valid phone number (7 to 15 digits).")
            validator(self.contact_number)


    class Meta:
        ordering = ['-post_date_time']
