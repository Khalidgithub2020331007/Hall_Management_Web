from rest_framework import generics
from .models import CreateOfficialTransaction
from .serializers import (
    CreateOfficialTransactionSerializer,
    CreateOfficialTransactionCreateSerializer,
)

class CreateOfficialTransactionListCreateView(generics.ListCreateAPIView):
    queryset = CreateOfficialTransaction.objects.all().order_by('-transaction_date_time')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOfficialTransactionCreateSerializer
        return CreateOfficialTransactionSerializer
