# =================
# lost_and_found models.py
# =================

from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from storages.backends.s3boto3 import S3Boto3Storage
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *
from django.core.validators import RegexValidator
from choices import LOST_FOUND_CHOICES

class New_LostAndFound(models.Model):
    status=models.CharField(max_length=20, choices=LOST_FOUND_CHOICES, default='lost')
    post_id = models.AutoField(primary_key=True)
    post_date_time = models.DateTimeField(auto_now_add=True)

    element_name = models.CharField(max_length=255)
    element_description = models.TextField()
    found_location = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    image = models.ImageField(upload_to='lost_and_found/', blank=True, null=True)
    user_email = models.ForeignKey(
        UserInformation,
        on_delete=models.CASCADE,
        related_name='lost_and_found_posts'
    )

    def __str__(self):
        return f"{self.element_name} - {self.user_email.email} ({self.post_date_time.strftime('%Y-%m-%d')})"
    
    def clean(self):
        if not self.element_name.strip():
            raise ValidationError({'element_name': "Element name cannot be empty or just whitespace."})

        if not self.contact_number and not self.user_email.email:
            raise ValidationError("At least one contact method (phone or email) must be provided.")

        if self.contact_number:
            validator = RegexValidator(r'^\+?\d{7,15}$', "Enter a valid phone number (7 to 15 digits).")
            validator(self.contact_number)

    # +++ ADDED: Custom save method for MinIO integration +++
    def save(self, *args, **kwargs):
        if self.image and hasattr(self.image, 'file'):
            self.image.storage = S3Boto3Storage()
        
        super().save(*args, **kwargs)
    # +++ END OF ADDED CODE +++

    class Meta:
        ordering = ['-post_date_time']
