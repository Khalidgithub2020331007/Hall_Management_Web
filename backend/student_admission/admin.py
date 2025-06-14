# =============================
# student_admission/admin.py
# =============================

from django.contrib import admin
from .models import *
# Register your models here.


# =============================
# APPLICATION ADMIN
# =============================
@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'registration_number', 'name', 'department_name',
        'study_program', 'session', 'semester',
        'cgpa', 'last_semester_gpa', 'attached_hall',
        'is_resident_in_any_hall', 'home_distance_from_SUST_in_km'
    )
    search_fields = [
        'registration_number', 'name', 'department_name', 'attached_hall__hall_name'
    ]
    list_filter = ['study_program', 'gender', 'is_resident', 'attached_hall', 'session']
    list_per_page = 25

    def is_resident_in_any_hall(self, obj):
        return "Yes" if obj.is_resident else "No"
    is_resident_in_any_hall.short_description = 'Is Resident in Any Hall'


# =============================
# ADMISSION ADMIN
# =============================
@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = (
        'registration_number', 'room_number', 'hall'
    )


# =============================
# STUDENT ADMIN
# =============================
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'registration_number', 'email','name', 'department',
        'semester', 'session', 'room','hall'
    )
    search_fields = ('registration_number', 'email', 'department', 'semester', 'room__room_number', 'hall__hall_name')

    list_filter = ('department', 'semester')



