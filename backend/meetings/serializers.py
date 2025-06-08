from rest_framework import serializers
from .models import CreateMeeting, AddTopic
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *

class CreateMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreateMeeting
        fields = '__all__'

    def validate_meeting_date_time(self, value):
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError("Meeting date/time must be in the future.")
        return value


class AddTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddTopic
        fields = '__all__'

    def validate(self, data):
        from django.utils import timezone
        meeting_time = data['meeting_date_time'].meeting_date_time
        if meeting_time < timezone.now():
            raise serializers.ValidationError("Cannot add topic to past meetings.")
# <<<<<<< HEAD
        return data
