# =================
# Complain  Models.py
# =================


from django.db import models, transaction
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from choices import *
from registration.models import *


class Make_Complaints(models.Model):
    complain_id=models.AutoField(primary_key=True)
    complainant_registration_number = models.ForeignKey(Student, on_delete=models.CASCADE)
    complain_date = models.DateField(auto_now_add=True)
    complain_tag = models.CharField(max_length=20, choices=COMPLAIN_TAG)
    complain_details = models.CharField(max_length=1000)
    complain_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Received')

    def __str__(self):
        return f"Complain on {self.complain_tag} by {self.complainant_registration_number.registration_number}"


    def save(self, *args, **kwargs):
        is_new = self._state.adding

        # Get old status before saving
        old_status = None
        if not is_new and self.pk is not None:
            try:
                old_complain = Make_Complaints.objects.get(pk=self.pk)
                old_status = old_complain.complain_status
            except Make_Complaints.DoesNotExist:
                old_status = None
        

        super().save(*args, **kwargs)  # Save the Complain first

        system_goal, _ = SystemGoal.objects.get_or_create(id=1)

        if is_new:
            system_goal.total_complaints_received += 1
        elif old_status != 'Resolved' and self.complain_status == 'Resolved':
            system_goal.total_complaints_resolved += 1

        system_goal.save()



# =================
# SystemGoal
# =================
class SystemGoal(models.Model):
    total_complaints_received = models.PositiveBigIntegerField(default=0)
    total_complaints_resolved = models.PositiveBigIntegerField(default=0)


    def __str__(self):
        return f"Complaints: {self.total_complaints_received}, Solved: {self.total_complaints_resolved}"

