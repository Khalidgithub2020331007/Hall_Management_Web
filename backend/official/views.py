# =====================
# Official views.py
# =====================
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *
from .serializers import *



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


# ============================
# DiningShopCanteen ViewSet
# ============================
class DiningShopCanteenViewSet(viewsets.ModelViewSet):
    queryset = Dining_Shop_Canteen.objects.all()
    serializer_class = DiningShopCanteenSerializer


# ============================
# AddOffice ViewSet
# ============================
class OfficialRegistrationViewSet(viewsets.ModelViewSet):
    queryset = OfficialRegistration.objects.all()
    serializer_class = OfficialRegistrationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            return Response(
                {"message": "Office member created successfully!", "data": OfficialRegistrationSerializer(instance).data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
