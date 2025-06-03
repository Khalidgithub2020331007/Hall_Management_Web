# ========================
# registration/admin.py
# =====================

from django.contrib import admin
from .models import (
    Hall, Room, Application, Admission,
    UserInformation, Student,
    ProvostBody, OfficialPerson, AddOffice,Dining_Shop_Canteen
)



# =============================
# INLINE ADMIN FOR ROOM MODEL
# =============================
class RoomInline(admin.TabularInline):
    model = Room
    extra = 1


# =============================
# USER INFORMATION ADMIN
# =============================
@admin.register(UserInformation)
class UserInformationAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'phone_number','password','user_role', 'hall', 'image')
    search_fields = ['email', 'name', 'phone_number', 'user_role', 'hall__hall_name']
    list_filter = ('user_role', 'hall')



# =============================
# HALL ADMIN
# =============================
@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    inlines = [RoomInline]
    list_display = (
        'hall_name', 'total_room', 'total_number_of_seat',
        'admitted_students', 'vacant_seats_display', 'room_list'
    )
    search_fields = ['hall_name']

    def vacant_seats_display(self, obj):
        return obj.vacant_seats
    vacant_seats_display.short_description = 'Vacant Seats'


# =============================
# ROOM ADMIN
# =============================
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        'room_number', 'hall', 'capacity',
        'admitted_students', 'vacancy_display', 'student_list'
    )
    search_fields = ['room_number', 'hall__hall_name']

    def vacancy_display(self, obj):
        return obj.vacancy
    vacancy_display.short_description = 'Vacancy'


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
    search_fields = ('registration_number', 'email', 'department', 'semester', 'room_number','hall')
    list_filter = ('department', 'semester')



# =============================
# PROVOST BODY ADMIN
# =============================
@admin.register(ProvostBody)
class ProvostBodyAdmin(admin.ModelAdmin):
    list_display = ('email','name','provost_body_role', 'department_role', 'department','hall')
    search_fields = ('email','name', 'department', 'provost_body_role', 'department_role','hall')
    list_filter = ('provost_body_role', 'department_role', 'department')


# =============================
# OFFICIAL PERSON ADMIN
# =============================
@admin.register(OfficialPerson)
class OfficialPersonAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'official_role','hall')
    search_fields = ('email', 'name', 'official_role','hall')
    list_filter = ('official_role',)

# =============================
# Dining Canteen Shop ADMIN
# =============================
@admin.register(Dining_Shop_Canteen)
class DiningShopCanteenAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'official_role', 'hall')
    search_fields = ('email', 'name', 'official_role', 'hall__hall_name')
    list_filter = ('official_role', 'hall')  






# =============================
# ADD OFFICE ADMIN
# =============================
@admin.register(AddOffice)
class AddOfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'user_role', 'hall', 'blood_group')
    search_fields = ('name', 'email', 'phone_number', 'user_role', 'hall__hall_name')
    list_filter = ('user_role', 'hall')

    
    # Only include valid foreign key fields
    # raw_id_fields = ('role', 'provost_body_role', 'department_role')
