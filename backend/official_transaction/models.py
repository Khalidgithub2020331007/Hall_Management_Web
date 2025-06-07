from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *
class CreateOfficialTransaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    transaction_date_time = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=255)
    transaction_description = models.TextField()
    transaction_amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_file = models.JSONField(default=list, blank=True, null=True)  # List of file paths or URLs
    user_email = models.ForeignKey(
        OfficialPerson,
        on_delete=models.CASCADE,
        related_name='transactions'
    )

    def add_file(self, file_path: str):
        file_path = file_path.strip()
        if file_path not in self.transaction_file:
            self.transaction_file.append(file_path)
            self.save(update_fields=['transaction_file'])

    def __str__(self):
        return f"{self.transaction_type} - {self.user_email} ({self.transaction_date_time.strftime('%Y-%m-%d')})"

    class Meta: 
        ordering = ['-transaction_date_time']


class AddFile(models.Model):
    transaction = models.ForeignKey(CreateOfficialTransaction, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='transactions/')

    def __str__(self):
        return f"File for {self.transaction.transaction_type} - {self.file.name}"

    def save(self, *args, **kwargs):
        self.full_clean()
        with transaction.atomic():
            super().save(*args, **kwargs)
            self.transaction.add_file(self.file.name)
