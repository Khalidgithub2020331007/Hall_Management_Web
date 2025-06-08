from django.db import models
from django.core.exceptions import ValidationError
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *
# ====================
# SportsEquipment
# ====================

class SportsEquipment(models.Model):
    serial_number = models.AutoField(primary_key=True)

    guard_email = models.ForeignKey(
        OfficialPerson,
        on_delete=models.CASCADE, 
        related_name='equipment_registered'
    )

    reference_registration_number = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name='equipment_checked_out'
    )

    equipment_name_and_number = models.TextField()

    checked_out_time = models.DateTimeField()
    checked_in_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        student_id = self.reference_registration_number.registration_number  # adjust based on actual field
        guard_email = getattr(self.guard_email, 'email', 'Unknown')
        checked_out = self.checked_out_time.strftime('%Y-%m-%d %H:%M:%S')
        return (
            f"Equipment '{self.equipment_name_and_number}' checked out by Student {student_id}, "
            f"checked out at {checked_out}, registered by {guard_email}"
        )
    
    def clean(self):
        if self.checked_in_time and self.checked_in_time < self.checked_out_time:
            raise ValidationError("Check-in time cannot be earlier than check-out time.")

    class Meta:
        ordering = ['-checked_out_time']
