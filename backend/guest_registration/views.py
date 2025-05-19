from rest_framework  import viewsets
from .models import GuestRegistration
from guest_registration.serializers import *

class GuestRegistrationViewSet(viewsets.ModelViewSet):
    queryset=GuestRegistration.objects.all()
    serializer_class=GuestRegistrationSerializer