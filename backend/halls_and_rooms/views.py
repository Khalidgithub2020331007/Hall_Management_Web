# =====================
# Halls and Rooms View
# =====================
from rest_framework import viewsets
from rest_framework import filters
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
from rest_framework import filters

class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['room_number']

    def get_queryset(self):
        queryset = super().get_queryset()
        hall_name = self.request.query_params.get('hall')
        if hall_name:
            queryset = queryset.filter(hall__hall_name=hall_name)
        return queryset