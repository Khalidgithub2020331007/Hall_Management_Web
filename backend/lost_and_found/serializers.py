# =================
# lost_and_found serializers.py
# =================


from rest_framework import serializers
from .models import New_LostAndFound
from user_info.models import UserInformation
class UserInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInformation
        fields = ['id', 'name', 'email', 'hall']

class LostAndFoundSerializer(serializers.ModelSerializer):
    user_email = UserInformationSerializer(read_only=True)
    user_email_id = serializers.PrimaryKeyRelatedField(
        queryset=UserInformation.objects.all(),
        source='user_email',
        write_only=True
    )

    class Meta:
        model = New_LostAndFound
        fields = [
            'post_id',
            'post_date_time',
            'element_name',
            'element_description',
            'found_location',
            'contact_number',
            'image',
            'user_email',
            'user_email_id',
        ]
