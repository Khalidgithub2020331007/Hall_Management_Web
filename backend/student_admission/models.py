# =============================
# student_admission/models.py
# =============================

import random
import string
from halls_and_rooms.models import Hall, Room
from choices import * 
from django.db import models
from django.core.exceptions import ValidationError
from django.db import transaction
from user_info.models import UserInformation
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator

# =====================
# PHONE NUMBER VALIDATOR
# =====================
phone_regex = RegexValidator(
    regex=r'^(\+8801[3-9]\d{8}|01[3-9]\d{8})$',
    message="Phone number must be in the format '+8801XXXXXXXXX' or '01XXXXXXXXX'."
)

# =====================
# Registration NUMBER VALIDATOR
# =====================
registration_number_validator = RegexValidator(
    regex=r'^\d{10}$',
    message='Registration number must be exactly 10 digits.'
)

# =====================
# APPLICATION MODEL
# =====================

class Application(models.Model):


    registration_number = models.CharField(
        max_length=10,
        primary_key=True,
        validators=[registration_number_validator],
        help_text='Must be exactly 10 digits (e.g., 20XXXXXXXX)'
    )

    name = models.CharField(max_length=100)
    phone_number = models.CharField(
            validators=[phone_regex],
            max_length=14,
            help_text="Enter 11-digit local or 14-digit international format (e.g., 01XXXXXXXXX or +8801XXXXXXXXX)"
        )    
    email = models.EmailField(unique=True)
    blood_group =models.CharField(max_length=100,choices= BLOOD_GROUP_CHOICES)
    father_name = models.CharField(max_length=100)
    mother_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    department_name = models.CharField(max_length=100)
    study_program = models.CharField(max_length=20, choices=STUDY_PROGRAM_CHOICES)
    session = models.CharField(max_length=10, choices=SESSION_CHOICES)
    semester = models.CharField(max_length=20, choices=SEMESTER_CHOICES)
    permanent_address = models.TextField()
    home_distance_from_SUST_in_km = models.FloatField()
    family_monthly_income = models.PositiveIntegerField()
    special_reason_for_hall_seat = models.TextField(blank=True, null=True)
    total_credits_offered = models.FloatField()
    total_credits_completed = models.FloatField()
    cgpa = models.FloatField()
    last_semester_gpa = models.FloatField()
    attached_hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)
    is_resident = models.BooleanField()
    resident_months_in_university_hall = models.PositiveIntegerField(blank=True, null=True)
    convicted = models.BooleanField(help_text='Have ever been penalized by university authority?')
    profile_picture = models.ImageField(upload_to='student_profile_pictures/', null=True, blank=True)

    def clean(self):
        super().clean()
        
        # Resident months validation
        if self.is_resident:
            if not self.resident_months_in_university_hall or self.resident_months_in_university_hall <= 0:
                raise ValidationError({
                    'resident_months_in_university_hall': 'Must be greater than 0 if the student is a resident.'
                })
        else:
            self.resident_months_in_university_hall = 0
    
        # Credits validation
        if self.total_credits_offered <= self.total_credits_completed:
            raise ValidationError({
                'total_credits_offered': 'Total credits offered must be greater than total credits completed.',
                'total_credits_completed': 'Total credits completed must be less than total credits offered.'
            })
    
        # CGPA validation
        if self.cgpa > 4.0:
            raise ValidationError({'cgpa': 'CGPA cannot exceed 4.0.'})
    
        if self.last_semester_gpa > 4.0:
            raise ValidationError({'last_semester_gpa': 'Last semester GPA cannot exceed 4.0.'})
    

    def save(self, *args, **kwargs):
        if not self.is_resident:
            self.resident_months_in_university_hall = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.registration_number} - {self.name}"


# =====================
# STUDENT MODEL
# =====================
class Student(models.Model):
    registration_number = models.CharField(max_length=100, unique=True)
    email = models.EmailField()
    name=models.CharField(max_length=100,default="")
    department = models.CharField(max_length=100, default='')
    semester = models.CharField(max_length=20)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    
    session = models.CharField(max_length=10)
    hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)


    def __str__(self):
        return f"{self.name} ({self.registration_number})"
    


# =====================
# ADMISSION MODEL
# =====================
class Admission(models.Model):
    registration_number = models.OneToOneField(
        Application,
        on_delete=models.CASCADE,
        to_field='registration_number',
        primary_key=True
    )
    password = models.CharField(max_length=100, editable=False)  # Not editable via forms/admin
    room_number = models.ForeignKey(Room, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)

    def clean(self):
        if self.room_number.hall != self.hall:
            raise ValidationError("Selected room does not belong to the selected hall.")
        if Student.objects.filter(registration_number=self.registration_number.registration_number).exists():
            raise ValidationError("This student is already admitted.")
        # Fix here:
        if self.registration_number.is_resident and not self.registration_number.attached_hall:
            raise ValidationError({'attached_hall': 'Resident must be attached to a hall.'})
    


    def save(self, *args, **kwargs):
        self.full_clean()
                # Auto-generate password if not set
        if not self.password:
            self.password = self.generate_random_password()
        application = self.registration_number

        with transaction.atomic():
            self.room_number.admit_student(application.registration_number)
            self.hall.admit_student()

            super().save(*args, **kwargs)

            UserInformation.objects.update_or_create(
                email=application.email,
                defaults={
                    'name': application.name,
                    'image': application.profile_picture,
                    'phone_number': application.phone_number,
                    'password': self.password,
                    'blood_group': application.blood_group,
                    'hall': self.hall,
                    'user_role': 'student'
                }
            )

            Student.objects.update_or_create(
                registration_number=application.registration_number,
                defaults={
                    'email': application.email,
                    'name':application.name,
                    'department': application.department_name,
                    'semester': application.semester,
                    'room': self.room_number,
                    'session': application.session,
                    'hall':self.hall
                }
            )

            application.delete()

    @staticmethod
    def generate_random_password(length=8):
        characters = string.ascii_letters + string.digits
        return ''.join(random.choices(characters, k=length))

    def __str__(self):
        return str(self.registration_number.registration_number)
