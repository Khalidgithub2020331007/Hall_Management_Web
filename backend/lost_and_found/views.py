from django.shortcuts import render

from rest_framework import viewsets
from .models import LostAndFound
from .serializers import LostAndFoundSerializer

class LostAndFoundViewSet(viewsets.ModelViewSet):
    queryset = LostAndFound.objects.all().order_by('-post_date_time')
    serializer_class = LostAndFoundSerializer
