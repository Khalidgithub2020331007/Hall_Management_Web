from rest_framework import viewsets
from .models import SportsEquipment
from .serializers import SportsEquipmentSerializer 

class SportsEquipmentViewSet(viewsets.ModelViewSet):
    queryset = SportsEquipment.objects.all()
    serializer_class = SportsEquipmentSerializer
