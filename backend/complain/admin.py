# =================
# Complain  admin.py
# =================



from django.contrib import admin
from .models import Make_Complaints, SystemGoal

@admin.register(Make_Complaints)
class MakeComplaintsAdmin(admin.ModelAdmin):
    list_display = (
        'complain_id',
        'complainant_registration_number',
        'complainant_name',
        'complain_tag',
        'complain_status',
        'complain_date',
    )
    search_fields = [
        'complainant_registration_number__registration_number',
        'complainant_registration_number__name',
        'complain_tag',
        'complain_status',
        'complain_date',
    ]
    readonly_fields = ('complain_date',)

    def complainant_name(self, obj):
        # Get name from related Student model dynamically
        return obj.complainant_registration_number.name
    complainant_name.short_description = 'Complainant Name'


@admin.register(SystemGoal)
class SystemGoalAdmin(admin.ModelAdmin):
    list_display = ('total_complaints_received', 'total_complaints_resolved')