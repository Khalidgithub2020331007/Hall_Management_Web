# =================
# lost_and_found views.py
# =================

from django.shortcuts import render

from rest_framework import viewsets
from .models import New_LostAndFound
from .serializers import LostAndFoundSerializer

class LostAndFoundViewSet(viewsets.ModelViewSet):
    queryset = New_LostAndFound.objects.all().order_by('-post_date_time')
    serializer_class = LostAndFoundSerializer
