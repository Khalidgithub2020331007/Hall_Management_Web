from django.shortcuts import render
from django.contrib.auth.hashers import check_password
from .models import *
from .serializers import *
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

# =====================
# UserInformation ViewSet
# =====================
class UserInformationViewSet(viewsets.ModelViewSet):
    queryset = UserInformation.objects.all()
    serializer_class = UserInformationSerializer

# ====================
# Login API View
# ====================
class UserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email','').strip()
        password = request.data.get('password','').strip()

        if not email or not password:
            return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserInformation.objects.get(email=email)

            if user.password != password:
                return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


            # ✅ Check against hashed password
            # if not check_password(password, user.password):
            #     return Response({'detail': 'Invalid credentialss.'}, status=status.HTTP_401_UNAUTHORIZED)

            serializer = UserInformationSerializer(user)
            return Response(serializer.data)

        except UserInformation.DoesNotExist:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
