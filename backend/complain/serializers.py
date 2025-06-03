# =================
# Complain views.py
# =================


from rest_framework import viewsets
from .models import Make_Complaints, SystemGoal
from .serializers import MakeComplaintsSerializer, SystemGoalSerializer

class Make_ComplaintsViewSet(viewsets.ModelViewSet):
    queryset = Make_Complaints.objects.all()
    serializer_class = MakeComplaintsSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

class SystemGoalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemGoal.objects.all()
    serializer_class = SystemGoalSerializer