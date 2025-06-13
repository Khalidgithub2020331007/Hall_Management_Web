from django.db import models, transaction
from django.core.exceptions import ValidationError, ObjectDoesNotExist
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
    