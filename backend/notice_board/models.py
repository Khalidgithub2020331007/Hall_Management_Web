# =================
# notices/models.py
# =================

from django.db import models, transaction
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from storages.backends.s3boto3 import S3Boto3Storage # <-- Import S3Boto3Storage
from choices import *
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *

class Notices(models.Model):
    notice_id = models.AutoField(primary_key=True)
    notice_sender_email = models.ForeignKey(
        ProvostBody, on_delete=models.CASCADE, related_name='notices'
    )
    notice_data_and_time = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='notices/', blank=True, null=True)
    
    def __str__(self):
        sender_name = getattr(self.notice_sender_email, 'name', 'Unknown Sender')
        return f"[{self.notice_data_and_time.strftime('%Y-%m-%d %H:%M')}] {self.title} by {sender_name}"

    # +++ ADDED: Custom save method for MinIO integration +++
    def save(self, *args, **kwargs):
        """
        Overrides the default save method to handle file uploads to MinIO.
        """
        # Check if a new file is being uploaded with this notice instance.
        if self.file and hasattr(self.file, 'file'):
            # If so, explicitly set the storage backend to S3Boto3Storage for this operation.
            self.file.storage = S3Boto3Storage()
        
        # Call the parent class's save method to perform the actual save.
        super().save(*args, **kwargs)
    # +++ END OF ADDED CODE +++
