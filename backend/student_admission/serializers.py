# =============================
# student_admission/serializers.py
# =============================

from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import *

# =======================
# APPLICATION SERIALIZER
# =======================
class ApplicationSerializer(serializers.ModelSerializer):
    attached_hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), allow_null=True)

    class Meta:
        model = Application
        fields = [
            'registration_number', 'name', 'phone_number', 'email', 'blood_group',
            'father_name', 'mother_name', 'gender', 'department_name',
            'study_program', 'session', 'semester', 'permanent_address',
            'home_distance_from_SUST_in_km', 'family_monthly_income',
            'special_reason_for_hall_seat', 'total_credits_offered', 'total_credits_completed',
            'cgpa', 'last_semester_gpa', 'attached_hall', 'is_resident',
            'resident_months_in_university_hall', 'convicted', 'profile_picture'
        ]







# =======================
# STUDENT SERIALIZER
# =======================
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'registration_number', 'email',
            'department', 'semester', 'room_number', 'session'
        ]



# =======================
# ADMISSION SERIALIZER
# =======================
class AdmissionSerializer(serializers.ModelSerializer):
    registration_number = serializers.PrimaryKeyRelatedField(queryset=Application.objects.all())
    room_number = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())

    class Meta:
        model = Admission
        fields = ['registration_number', 'password', 'room_number', 'hall']

    def validate(self, attrs):
        room = attrs.get('room_number')
        hall = attrs.get('hall')
        if room.admitted_students >= room.capacity:
            raise serializers.ValidationError("This room is already full.")

        if room.hall != hall:
            raise serializers.ValidationError("Selected room does not belong to the selected hall.")
        registration_number = attrs.get('registration_number')
        if Student.objects.filter(registration_number=registration_number.registration_number).exists():
            raise serializers.ValidationError("This student is already admitted.")
        return attrs

    def create(self, validated_data):
        # Use model save method which includes admission logic
        admission = Admission(**validated_data)
        admission.save()
        return admission




