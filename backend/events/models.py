from django.db import models, transaction
from registration.models import ProvostBody

class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_name = models.CharField(max_length=255)
    event_description = models.TextField()
    event_date_time = models.DateTimeField()
    event_location = models.TextField()
    event_file = models.JSONField(default=list, blank=True, null=True)  # List of file paths or URLs
    event_publicist_email = models.ForeignKey(
        ProvostBody,
        on_delete=models.CASCADE,
        related_name='events'
    )

    def add_file(self, file_path: str):
        file_path = file_path.strip()
        if file_path not in self.event_file:
            self.event_file.append(file_path)
            self.save(update_fields=['event_file'])

    def __str__(self):
        return f"{self.event_name} - {self.event_publicist_email.email} ({self.event_date_time.strftime('%Y-%m-%d')})"


class AddFile(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='events/')

    def __str__(self):
        return f"File for {self.event.event_name} - {self.file.name}"

    def save(self, *args, **kwargs):
        self.full_clean()
        with transaction.atomic():
            super().save(*args, **kwargs)
            # Append the file name/path to event_file JSONField
            # Use self.file.name to get the relative file path stored
            self.event.add_file(self.file.name)
