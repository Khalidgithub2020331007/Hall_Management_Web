# =================
# events views.py
# =================

from rest_framework import generics
from .models import Create_Event
from .serializers import CreateEventSerializer, CreateEventCreateSerializer

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Create_Event.objects.all().order_by('-event_date_time')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateEventCreateSerializer
        return CreateEventSerializer
