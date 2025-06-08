# =====================
# user_info/serializers.py
# =====================

from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import *






# =======================
# USER INFORMATION SERIALIZER
# =======================

class UserInformationSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), allow_null=True)

    class Meta:
        model = UserInformation
        fields = [
            'id', 'email', 'name', 'image',
            'phone_number', 'password', 'role',
            'blood_group', 'hall'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = UserInformation(**validated_data)
        if password:
            user.set_password(password)  # Handles hashing correctly
        user.save()
        return user
