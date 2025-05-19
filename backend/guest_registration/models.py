from django.db import models
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from registration.models import UserInformation,OfficialPerson

# =======================
# Guest GuestRegistration
# =======================

class GuestRegistration(models.Model):
    guest_id = models.AutoField(primary_key=True)
    guest_name = models.CharField(max_length=100)
    
    reference_email = models.ForeignKey(
        UserInformation, 
        on_delete=models.CASCADE, 
        related_name='guests_referenced'
    )
    
    guard_email = models.ForeignKey(
        OfficialPerson,
        on_delete=models.CASCADE, 
        related_name='guests_registered'
    )

    entry_date_time = models.DateTimeField()
    exit_date_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return (
            f"{self.guest_name}, guest of {self.reference_email.email}, "
            f"entry at {self.entry_date_time.strftime('%Y-%m-%d %H:%M:%S')}, "
            f"registered by {self.guard_email.email}"
        )
    
    def clean(self):
        if self.exit_date_time and self.exit_date_time < self.entry_date_time:
            raise ValidationError("Exit date/time cannot be earlier than entry date/time.")

    class Meta:
        ordering = ['-entry_date_time']