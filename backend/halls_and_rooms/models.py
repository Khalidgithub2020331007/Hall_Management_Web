# =============================
# Halls and Rooms MODEL
# =============================


from django.core.exceptions import ValidationError
from django.db import models
from choices import BLOCK_CHOICES

# =====================
# HALL MODEL
# =====================
from django.core.exceptions import ValidationError

class Hall(models.Model):
    hall_id = models.AutoField(primary_key=True)
    hall_name = models.CharField(max_length=100,unique=True, help_text="Unique name for the hall")
    total_room = models.PositiveIntegerField()
    total_number_of_seat = models.PositiveIntegerField()
    admitted_students = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='hall_images/')
    room_list = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.hall_name

    @property
    def vacant_seats(self):
        return self.total_number_of_seat - self.admitted_students

    def clean(self):
        # Check admitted_students limit
        if self.admitted_students > self.total_number_of_seat:
            raise ValidationError("Admitted students cannot exceed total number of seats.")
        
        # Check for duplicate hall_name (case-insensitive)
        qs = Hall.objects.filter(hall_name__iexact=self.hall_name)
        # If updating existing record, exclude itself from check
        if self.pk:
            qs = qs.exclude(pk=self.pk)
        if qs.exists():
            raise ValidationError({"hall_name": "A hall with this name already exists."})

    def admit_student(self):
        if self.admitted_students >= self.total_number_of_seat:
            raise ValidationError("No vacant seat available in the hall.")
        self.admitted_students += 1
        self.save(update_fields=["admitted_students"])


# =====================
# ROOM MODEL
# =====================
class Room(models.Model):
    room_id = models.AutoField(primary_key=True)
    room_number = models.CharField(max_length=10)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name='rooms')
    block = models.CharField(max_length=100, choices=BLOCK_CHOICES, default='A')
    capacity = models.PositiveIntegerField()
    admitted_students = models.PositiveIntegerField(default=0)
    student_list = models.JSONField(default=list, blank=True)


    def __str__(self):
        return f"Room {self.room_number} ({self.hall.hall_name})"

    @property
    def vacancy(self):
        return self.capacity - self.admitted_students

    def clean(self):
        if Room.objects.filter(room_number=self.room_number, hall=self.hall).exclude(pk=self.pk).exists():
            raise ValidationError(f"Room number {self.room_number} already exists in this hall.")
        if self.admitted_students > self.capacity:
            raise ValidationError("Admitted students cannot exceed room capacity.")

    def admit_student(self, registration_number):
        if self.admitted_students >= self.capacity:
            raise ValidationError(f"Room {self.room_number} is full.")
        if registration_number in self.student_list:
            raise ValidationError(f"Student {registration_number} already in room.")
        self.admitted_students += 1
        self.student_list.append(registration_number)
        self.save(update_fields=["admitted_students", "student_list"])

    def save(self, *args, **kwargs):
        self.clean()
        if self.hall.room_list is None:
            self.hall.room_list = []
        if self.room_number not in self.hall.room_list:
            self.hall.room_list.append(self.room_number)
            self.hall.save(update_fields=["room_list"])

        super().save(*args, **kwargs)
