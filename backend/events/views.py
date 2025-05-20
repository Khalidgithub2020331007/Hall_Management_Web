from rest_framework import generics
from .models import Event
from .serializers import EventSerializer, EventCreateSerializer

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-event_date_time')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventSerializer
