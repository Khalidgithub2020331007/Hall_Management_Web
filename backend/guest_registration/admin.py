# =================
# guest_registration admin.py
# =================


from django.contrib import admin
from .models import Guest

# ====================
# Guest Admin 
# ====================
@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = (
        'guest_id',
        'guest_name',
        'reference_email',
        'reference_name',
        'reference_role',
        'hall',
        'guard_email',
        'guard_name',
        'entry_date_time',
        'exit_date_time',
    )
    search_fields = [
        'guest_name',
        'reference_email__email',
        'reference_email__name',
        'guard_email__email',
        'guard_email__name',
        'reference_email__hall__hall_name'

    ]

    def reference_name(self, obj):
        return obj.reference_email.name
    reference_name.short_description = 'Reference Name'

    def reference_role(self, obj):
        return obj.reference_email.user_role
    reference_role.short_description = 'Reference User Role'

    def guard_name(self, obj):
        return obj.guard_email.name
    guard_name.short_description = 'Guard Name'
    def hall(self, obj):
        return obj.reference_email.hall
    hall.short_description = 'Hall'
