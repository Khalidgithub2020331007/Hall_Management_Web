# =====================
# Official serializers.py
# =====================

from rest_framework import serializers
from .models import *


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
# ADD OFFICE SERIALIZER
# =======================
class AddOfficeSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())

    class Meta:
        model = AddOffice
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

        # Create AddOffice instance
        add_office_instance = AddOffice.objects.create(**validated_data)

        # Create UserInformation
        user_data = {
            'email': add_office_instance.email,
            'name': add_office_instance.name,
            'image': add_office_instance.profile_picture,
            'phone_number': add_office_instance.phone_number,
            'role': add_office_instance.user_role,
            'blood_group': add_office_instance.blood_group,
            'hall': add_office_instance.hall,
        }
        user = UserInformation(**user_data)
        if password:
            user.set_password(password)
        user.save()

        # Handle role-specific creation
        if add_office_instance.user_role == 'Provost_Body':
            ProvostBody.objects.create(
                email=add_office_instance.email,
                name=add_office_instance.name,
                provost_body_role=add_office_instance.provost_body_role,
                department=add_office_instance.department,
                department_role=add_office_instance.department_role
            )
        elif add_office_instance.user_role == 'Official_Person':
            OfficialPerson.objects.create(
                email=add_office_instance.email,
                name=add_office_instance.name,
                official_role=add_office_instance.official_role
            )

        return add_office_instance


    def update(self, instance, validated_data):
        validated_data.pop('password', None)  # Ignore password here
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
