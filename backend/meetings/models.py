from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone
from registration.models import ProvostBody


class CreateMeeting(models.Model):
    meeting_id = models.AutoField(primary_key=True)
    meeting_date_time = models.DateTimeField(unique=True)
    meeting_chairperson = models.ForeignKey(
        ProvostBody,
        on_delete=models.CASCADE,
        related_name='chaired_meetings'
    )
    meeting_members = models.TextField(blank=True, null=True)
    meeting_description = models.TextField()
    meeting_topic = models.JSONField(default=list, blank=True)
    meeting_decision = models.TextField(blank=True, null=True)
    meeting_minutes = models.TextField(blank=True, null=True)
    next_meeting_date_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return (
            f"Meeting ID: {self.meeting_id}, "
            f"Date: {self.meeting_date_time.strftime('%Y-%m-%d %H:%M')}, "
            f"Chairperson: {self.meeting_chairperson}"
        )

    def add_topic(self, topic_text):
        topic_text = topic_text.strip()
        if topic_text and topic_text not in self.meeting_topic:
            self.meeting_topic.append(topic_text)
            self.save()

    def clean(self):
        if self.meeting_date_time < timezone.now():
            raise ValidationError("Meeting date and time cannot be in the past.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class AddTopic(models.Model):
    meeting = models.ForeignKey(
        CreateMeeting,
        on_delete=models.CASCADE,
        related_name='added_topics'
    )
    topic_text = models.CharField(max_length=255)

    def clean(self):
        topic_text_clean = self.topic_text.strip()

        if not topic_text_clean:
            raise ValidationError("Topic text cannot be empty.")

        if self.meeting:
            if topic_text_clean in self.meeting.meeting_topic:
                raise ValidationError(f"Topic '{topic_text_clean}' already exists for this meeting.")

            if self.meeting.meeting_date_time < timezone.now():
                raise ValidationError("Cannot add a topic to a meeting that has already occurred.")

    def save(self, *args, **kwargs):
        self.full_clean()
        with transaction.atomic():
            super().save(*args, **kwargs)
            self.meeting.add_topic(self.topic_text.strip())

    def __str__(self):

        return f"Topic: {self.topic_text} (Meeting ID: {self.meeting.meeting_id})"
# >>>>>>> develop_khalid
