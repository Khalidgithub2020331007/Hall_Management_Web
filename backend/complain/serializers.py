# =================
# Complain serializers.py
# =================

from rest_framework import serializers
from .models import Make_Complaints, SystemGoal

class MakeComplaintsSerializer(serializers.ModelSerializer):
    # Dynamically add complainant_name from related Student
    complainant_name = serializers.CharField(source='complainant_registration_number.name', read_only=True)

    class Meta:
        model = Make_Complaints
        fields = [
            'complain_id',
            'complainant_registration_number',  # input field
            'complainant_name',                 # read-only display field
            'complain_date',
            'complain_tag',
            'complain_details',
            'complain_status',
        ]


class SystemGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemGoal
        fields = '__all__'