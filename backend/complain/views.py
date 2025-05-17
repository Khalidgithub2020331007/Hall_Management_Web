from rest_framework import viewsets
from .models import Complain
from .serializers import ComplainSerializer

class ComplainViewSet(viewsets.ModelViewSet):
    queryset = Complain.objects.all()
    serializer_class = ComplainSerializer

    def perform_create(self, serializer):
        student = serializer.validated_data.get('complainant_registration_number')
        # Get UserInformation from Student (adjust if different relation)
        user_info = student.user  
        serializer.save(
            complainant_name=user_info,
            complain_status='Received'
        )
