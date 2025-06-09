# =====================
# Halls and Rooms View
# =====================
from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import * 




# =====================
# Hall ViewSet
# =====================
class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all().order_by('hall_name')  # or order_by('id')
    serializer_class = HallSerializer



# =====================
# Room ViewSet
# =====================
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer