from django.contrib import admin
from .models import *

# =======================
# Sport's Equipment Admin
# =======================

@admin.register(SportsEquipment)
class SportsEquipmentAdmin(admin.ModelAdmin):
    list_display=(
        'serial_number',
        'reference_registration_number',
        'reference_name',
        'guard_email',
        'guard_name',
        'equipment_name_and_number',
        'hall',
        'checked_out_time',
        'checked_in_time',
    )
    search_fields = [
        'reference_registration_number__registration_number',
        'reference_registration_number__name',
        'guard_email__email',
        'guard_email__name',
        'equipment_name_and_number',
        'guard_email__hall__hall_name',
        # Remove 'hall'
    ]
    

    def hall(self, obj):
        return obj.guard_email.hall
    hall.short_description = 'Hall'

    def reference_name(self, obj):
        return obj.reference_registration_number.name
    reference_name.short_description = 'Reference Name'

    def guard_name(self, obj):
        return obj.guard_email.name
    guard_name.short_description = 'Guard Name'