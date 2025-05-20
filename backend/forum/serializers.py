from rest_framework import serializers
from .models import Forum

class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = ['post_id', 'user_email', 'post_date_time', 'text_message', 'file']
        read_only_fields = ['post_id', 'post_date_time']

    def validate(self, data):
        if not data.get('text_message') and not data.get('file'):
            raise serializers.ValidationError("Either text_message or file must be provided.")
        return data
