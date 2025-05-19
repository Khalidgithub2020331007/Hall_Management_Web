from rest_framework import serializers
from .models import *

class GuestRegistrationSerializer(serializers.ModelSerializer):
    reference_name=serializers.CharField(source='reference_email.name',read_only=True)
    reference_role=serializers.CharField(source='reference_email.user_role',read_only=True)
    guard_name=serializers.CharField(source='guard_email.name',read_only=True)
    hall=serializers.CharField(source='guard_email.hall',read_only=True)

    class Meta:
        model=GuestRegistration
        fields=[
        'guest_id',
        'guest_name',
        'reference_email',
        'reference_name',
        'reference_role',
        'guard_email',
        'guard_name',
        'hall',
        'entry_date_time',
        'exit_date_time',
        ]