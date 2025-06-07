# =============================
# Halls and Rooms MODEL
# =============================
from .models import *

from django.contrib import admin

# Register your models here.
# =============================
# INLINE ADMIN FOR ROOM MODEL
# =============================
class RoomInline(admin.TabularInline):
    model = Room
    extra = 1


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
