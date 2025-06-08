# =================
# forum serializers.py
# =================


from rest_framework import serializers
from .models import New_Forum_Post

class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = New_Forum_Post
        fields = ['post_id', 'user_email', 'post_date_time', 'text_message', 'file']
        read_only_fields = ['post_id', 'post_date_time']

    def validate(self, data):
        if not data.get('text_message') and not data.get('file'):
            raise serializers.ValidationError("Either text_message or file must be provided.")
        return data
