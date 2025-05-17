from rest_framework import serializers
from .models import Complain

class ComplainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complain
        fields = ['complainant_registration_number', 'complain_tag', 'complain_details']
