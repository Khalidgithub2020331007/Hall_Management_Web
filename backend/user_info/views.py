# =====================
# user_info/views.py
# =====================

from django.shortcuts import render

# Create your views here.

from .models import *
from .serializers import *
from rest_framework import viewsets, status





# =====================
# UserInformation ViewSet
# =====================
class UserInformationViewSet(viewsets.ModelViewSet):
    queryset = UserInformation.objects.all()
    serializer_class = UserInformationSerializer
