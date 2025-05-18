from rest_framework import viewsets
from .models import Complain,SystemGoal
from .serializers import ComplainSerializer,SystemGoalSerializer

class ComplainViewSet(viewsets.ModelViewSet):
    queryset = Complain.objects.all()
    serializer_class = ComplainSerializer
    def perform_create(self,serializer):
        instance=serializer.save()
        instance.save()
    def perform_update(self,serializer):
        instance=serializer.save()
        instance.save()
    
class SystemGoalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset=SystemGoal.objects.all()
    serializer_class=SystemGoalSerializer