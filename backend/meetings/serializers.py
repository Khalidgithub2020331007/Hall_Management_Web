# =====================
# Meetings seralizers.py
# =====================


from rest_framework import serializers
from .models import CreateMeeting, AddTopic
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *
from rest_framework import serializers
from .models import AddTopic
from django.utils import timezone
from meetings.models import CreateMeeting

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
        fields = ['id', 'topic_text', 'meeting']

    def validate(self, data):
        meeting_instance = data.get('meeting')

        if not meeting_instance:
            raise serializers.ValidationError("Meeting is required.")

        if meeting_instance.meeting_date_time < timezone.now():
            raise serializers.ValidationError("Cannot add topic to past meetings.")

        return data
