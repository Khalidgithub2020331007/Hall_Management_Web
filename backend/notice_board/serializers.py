from rest_framework import serializers
from .models import Notices

class NoticesSerializer(serializers.ModelSerializer):
    notice_sender_name = serializers.CharField(source='notice_sender_email.name', read_only=True)
    hall_name = serializers.CharField(source='notice_sender_email.hall.hall_name', read_only=True)

    class Meta:
        model = Notices
        fields = [
            'notice_id',
            'notice_sender_email',
            'notice_sender_name',
            'hall_name',
            'notice_data_and_time',
            'title',
            'description',
            'file',
        ]
