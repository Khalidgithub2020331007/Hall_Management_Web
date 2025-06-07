# =====================
# Official views.py
# =====================
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly



# ============================
# ProvostBody ViewSet
# ============================
class ProvostBodyViewSet(viewsets.ModelViewSet):
    queryset = ProvostBody.objects.all()
    serializer_class = ProvostBodySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# ============================
# OfficialPerson ViewSet
# ============================
class OfficialPersonViewSet(viewsets.ModelViewSet):
    queryset = OfficialPerson.objects.all()
    serializer_class = OfficialPersonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]



from .models import AddOffice, ProvostBody, OfficialPerson
from .serializers import (
    AddOfficeSerializer,
    ProvostBodySerializer,
    OfficialPersonSerializer
)


# ============================
# AddOffice ViewSet
# ============================
class AddOfficeViewSet(viewsets.ModelViewSet):
    queryset = AddOffice.objects.all()
    serializer_class = AddOfficeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(
                {"message": "Office member created successfully!", "data": AddOfficeSerializer(instance).data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
