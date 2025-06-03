# =================
# guest_registration views.py
# =================

from rest_framework  import viewsets
from .models import Guest
from guest_registration.serializers import *

class GuestViewSet(viewsets.ModelViewSet):
    queryset=Guest.objects.all()
    serializer_class=GuestSerializer
