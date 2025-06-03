# ========================
# registration/views.py
# =====================

from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
import traceback

from .models import *
from .serializers import *


# =====================
# Home View
# =====================
def home(request):
    return HttpResponse("Welcome to the Hall Management System!")


# =====================
# Hall ViewSet
# =====================
class HallViewSet(viewsets.ModelViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer


# =====================
# Room ViewSet
# =====================
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


# =====================
# Student ViewSet
# =====================
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


# =====================
# UserInformation ViewSet
# =====================
class UserInformationViewSet(viewsets.ModelViewSet):
    queryset = UserInformation.objects.all()
    serializer_class = UserInformationSerializer

# =====================
# Admission ViewSet
# =====================
class AdmissionViewSet(viewsets.ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer


# =====================
# Application ViewSet
# # =====================
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
# class ApplicationViewSet(viewsets.ModelViewSet):
#     queryset = Application.objects.all()
#     serializer_class = ApplicationSerializer

#     @action(detail=True, methods=['post'])
#     def admit_student(self, request, pk=None):
#         """
#         Custom action to admit a student based on their application.
#         """

#         application = self.get_object()

#         try:
#             # Check if the application has an attached hall and assigned room number
#             if not application.attached_hall:
#                 return Response({"error": "Application does not have an attached hall."},
#                                 status=status.HTTP_400_BAD_REQUEST)

#             # Here you must decide how to get the room for this student admission.
#             # Since Application model does not have a room_number field, you may want
#             # to get the room_number from request data or assign one automatically.
#             room_number = request.data.get('room_number')
#             if not room_number:
#                 return Response({"error": "Room number must be provided in request data."},
#                                 status=status.HTTP_400_BAD_REQUEST)

#             # Retrieve hall and room objects
#             hall = application.attached_hall
#             room = Room.objects.filter(room_number=room_number, hall=hall).first()
#             if not room:
#                 return Response({"error": "Room not found in the attached hall."},
#                                 status=status.HTTP_404_NOT_FOUND)

#             # Validate capacity
#             if room.admitted_students >= room.capacity:
#                 return Response({"error": "Room is already full."},
#                                 status=status.HTTP_400_BAD_REQUEST)

#             if hall.admitted_students >= hall.total_number_of_seat:
#                 return Response({"error": "Hall is already full."},
#                                 status=status.HTTP_400_BAD_REQUEST)

#             # Check if student already admitted
#             if Admission.objects.filter(registration_number=application.registration_number).exists():
#                 return Response({"error": "Student already admitted."},
#                                 status=status.HTTP_400_BAD_REQUEST)

#             # Get student role object (ensure your Role model has this user_role)
#             # try:
#             #     student_role = Role.objects.get(user_role=Role.UserRoleChoices.STUDENT)
#             # except Role.DoesNotExist:
#             #     return Response({"error": "Student role not configured in the system."},
#             #                     status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#             # Create Admission entry (password hashed)
#             admission = Admission.objects.create(
#                 registration_number=application,
#                 room_number=room,
#                 hall=hall,
#                 password=make_password(request.data.get('password', 'defaultpassword'))  # You can customize password
#             )

#             # Create UserInformation
#             user_info = UserInformation.objects.create(
#                 email=application.email,
#                 name=application.name,
#                 image=application.profile_picture,
#                 phone_number=application.phone_number,
#                 role=student_role,
#                 blood_group=application.blood_group,
#                 hall=hall,
#                 password=make_password(request.data.get('password', 'defaultpassword'))
#             )

#             # Create Student
#             student = Student.objects.create(
#                 registration_number=application.registration_number,
#                 email=application.email,
#                 department=application.department_name,  # or application.department_code if you use that
#                 semester=application.semester,
#                 room_number=room,
#                 session=application.session
#             )

#             # Update seat counts
#             hall.admitted_students += 1
#             room.admitted_students += 1
#             hall.save()
#             room.save()

#             return Response({
#                 "status": "success",
#                 "message": "Student admitted successfully.",
#                 "admission_id": admission.id,
#                 "student_registration_number": student.registration_number
#             }, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             traceback.print_exc()
#             return Response({
#                 "status": "error",
#                 "message": str(e)
#             }, status=status.HTTP_400_BAD_REQUEST)




# =====================
# AddOffice ViewSet
# =====================
class AddOfficeViewSet(viewsets.ModelViewSet):
    queryset = AddOffice.objects.all()
    serializer_class = AddOfficeSerializer
