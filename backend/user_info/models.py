# =====================
# user_info/models.py
# =====================


from django.db import models
from halls_and_rooms.models import Hall
from choices import *

# =====================
# USER INFORMATION MODEL
# =====================
class UserInformation(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='user_images/', null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    password = models.CharField(max_length=100)
    user_role = models.CharField(max_length=100, choices=USER_ROLE, default='provost_body')
    blood_group = models.CharField(max_length=10)
    hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.email} ({self.user_role})"
