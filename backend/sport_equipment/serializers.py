from rest_framework import serializers
from .models import SportsEquipment

# ============================
# Sports Equipment Serializer
# ============================

class SportsEquipmentSerializer(serializers.ModelSerializer):
    reference_name = serializers.CharField(source='reference_registration_number.name', read_only=True)
    guard_name = serializers.CharField(source='guard_email.name', read_only=True)
    hall = serializers.CharField(source='reference_registration_number.hall.hall_name', read_only=True)

    class Meta:
        model = SportsEquipment
        fields = [
            'serial_number',
            'reference_registration_number',
            'reference_name',
            'guard_email',
            'guard_name',
            'equipment_name_and_number',
            'hall',
            'checked_out_time',
            'checked_in_time',
        ]
