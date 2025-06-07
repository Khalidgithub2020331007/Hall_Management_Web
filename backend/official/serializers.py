# =====================
# Official serializers.py
# =====================

from rest_framework import serializers
from .models import *
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *


# =======================
# PROVOST BODY SERIALIZER
# =======================
class ProvostBodySerializer(serializers.ModelSerializer):

    class Meta:
        model = ProvostBody
        fields = ['email','provost_body_role', 'department', 'department_role']


# =======================
# OFFICIAL PERSON SERIALIZER
# =======================
class OfficialPersonSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OfficialPerson
        fields = ['email', 'official_role']

# =======================
# DiningShopCanteen SERIALIZER
# =======================

class DiningShopCanteenSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())

    class Meta:
        model = Dining_Shop_Canteen
        fields = ['id', 'email', 'name', 'official_role', 'hall']

# =======================
# ADD OFFICE SERIALIZER
# =======================
class OfficialRegistrationSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())

    class Meta:
        model = OfficialRegistration
        fields = [
            'name', 'email', 'phone_number', 'password',
            'user_role', 'blood_group', 'hall',
            'provost_body_role', 'department', 'department_role',
            'official_role', 'profile_picture'
        ]

    def validate(self, attrs):
        role = attrs.get('user_role')
        if role == 'Provost_Body':
            if not attrs.get('provost_body_role') or not attrs.get('department') or not attrs.get('department_role'):
                raise serializers.ValidationError("Provost body role, department, and department role are required.")
        elif role == 'Official_Person':
            if not attrs.get('official_role'):
                raise serializers.ValidationError("Official role is required for Official Person.")
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password', None)

        # Create OfficialRegistration instance
        official_registration_instance = OfficialRegistration.objects.create(**validated_data)

        # Create UserInformation instance
        user_data = {
            'email': official_registration_instance.email,
            'name': official_registration_instance.name,
            'image': official_registration_instance.profile_picture,
            'phone_number': official_registration_instance.phone_number,
            'role': official_registration_instance.user_role,
            'blood_group': official_registration_instance.blood_group,
            'hall': official_registration_instance.hall,
        }
        user = UserInformation(**user_data)
        if password:
            user.set_password(password)
        user.save()

        # Role-specific creation with hall included
        if official_registration_instance.user_role == 'Provost_Body':
            ProvostBody.objects.create(
                email=official_registration_instance.email,
                name=official_registration_instance.name,
                provost_body_role=official_registration_instance.provost_body_role,
                department=official_registration_instance.department,
                department_role=official_registration_instance.department_role,
                hall=official_registration_instance.hall  # <-- Add here
            )
        elif official_registration_instance.user_role == 'Official_Person':
            OfficialPerson.objects.create(
                email=official_registration_instance.email,
                name=official_registration_instance.name,
                official_role=official_registration_instance.official_role,
                hall=official_registration_instance.hall  # <-- Add here
            )

        return official_registration_instance


    def update(self, instance, validated_data):
        validated_data.pop('password', None)  # Ignore password here
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
