from django.db import models, transaction
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from choices import *
import string
from django.utils.translation import gettext_lazy as _
import random
# =====================
# HALL MODEL
# =====================
class Hall(models.Model):
    hall_id = models.AutoField(primary_key=True)
    hall_name = models.CharField(max_length=100)
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
        if self.admitted_students > self.total_number_of_seat:
            raise ValidationError("Admitted students cannot exceed total number of seats.")

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


# =====================
# APPLICATION MODEL
# =====================
class Application(models.Model):


    registration_number = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    blood_group = models.CharField(max_length=10)
    father_name = models.CharField(max_length=100)
    mother_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    department_name = models.CharField(max_length=100)
    study_program = models.CharField(max_length=20, choices=STUDY_PROGRAM_CHOICES)
    session = models.CharField(max_length=10, choices=SESSION_CHOICES)
    semester = models.CharField(max_length=20, choices=SEMESTER_CHOICES)
    permanent_address = models.TextField()
    home_distance_from_SUST_in_km = models.FloatField()
    family_monthly_income = models.PositiveIntegerField()
    special_reason_for_hall_seat = models.TextField(blank=True, null=True)
    total_credits_offered = models.FloatField()
    total_credits_completed = models.FloatField()
    cgpa = models.FloatField()
    last_semester_gpa = models.FloatField()
    attached_hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)
    is_resident = models.BooleanField()
    resident_months_in_university_hall = models.PositiveIntegerField(blank=True, null=True)
    convicted = models.BooleanField(help_text='Have ever been penalized by university authority?')
    profile_picture = models.ImageField(upload_to='student_profile_pictures/', null=True, blank=True)

    def clean(self):
        super().clean()
        if self.is_resident:
            if not self.resident_months_in_university_hall or self.resident_months_in_university_hall <= 0:
                raise ValidationError({
                    'resident_months_in_university_hall': 'Must be greater than 0 if the student is a resident.'
                })
        else:
            # Optional: force it to zero to prevent manual error
            self.resident_months_in_university_hall = 0

    def save(self, *args, **kwargs):
        if not self.is_resident:
            self.resident_months_in_university_hall = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.registration_number} - {self.name}"

# =====================
# USER INFORMATION MODEL
# =====================
class UserInformation(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='user_images/', null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    password = models.CharField(max_length=100)
    user_role = models.CharField(max_length=100, choices=USER_ROLE, default='provost_body')
    blood_group = models.CharField(max_length=10)
    hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.email} ({self.user_role})"




# =====================
# STUDENT MODEL
# =====================
class Student(models.Model):
    registration_number = models.CharField(max_length=100, unique=True)
    email = models.EmailField()
    name=models.CharField(max_length=100,default="")
    department = models.CharField(max_length=100, default='')
    semester = models.CharField(max_length=20)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    session = models.CharField(max_length=10)
    hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)


    def __str__(self):
        return f"{self.name} ({self.registration_number})"
    


# =====================
# ADMISSION MODEL
# =====================
class Admission(models.Model):
    registration_number = models.OneToOneField(
        Application,
        on_delete=models.CASCADE,
        to_field='registration_number',
        primary_key=True
    )
    password = models.CharField(max_length=100, editable=False)  # Not editable via forms/admin
    room_number = models.ForeignKey(Room, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)

    def clean(self):
        if self.room_number.hall != self.hall:
            raise ValidationError("Selected room does not belong to the selected hall.")
        if Student.objects.filter(registration_number=self.registration_number.registration_number).exists():
            raise ValidationError("This student is already admitted.")
        if self.is_resident and not self.attached_hall:
            raise ValidationError({'attached_hall': 'Resident must be attached to a hall.'})


    def save(self, *args, **kwargs):
        self.full_clean()
                # Auto-generate password if not set
        if not self.password:
            self.password = self.generate_random_password()
        application = self.registration_number

        with transaction.atomic():
            self.room_number.admit_student(application.registration_number)
            self.hall.admit_student()

            super().save(*args, **kwargs)

            UserInformation.objects.update_or_create(
                email=application.email,
                defaults={
                    'name': application.name,
                    'image': application.profile_picture,
                    'phone_number': application.phone_number,
                    'password': self.password,
                    'blood_group': application.blood_group,
                    'hall': self.hall,
                    'user_role': 'student'
                }
            )

            Student.objects.update_or_create(
                registration_number=application.registration_number,
                defaults={
                    'email': application.email,
                    'name':application.name,
                    'department': application.department_name,
                    'semester': application.semester,
                    'room_number': self.room_number,
                    'session': application.session,
                    'hall':self.hall
                }
            )

            application.delete()

    @staticmethod
    def generate_random_password(length=8):
        characters = string.ascii_letters + string.digits
        return ''.join(random.choices(characters, k=length))

    def __str__(self):
        return str(self.registration_number.registration_number)

# =====================
# PROVOST BODY MODEL
# =====================
class ProvostBody(models.Model):
    email = models.EmailField("Official Email",unique=True)  # Usually, email should be unique
    name=models.CharField(max_length=100)
    provost_body_role = models.CharField(max_length=100,choices=PROVOST_BODY_ROLE,default='provost')

    department = models.CharField(max_length=100, default='')
    department_role = models.CharField(max_length=100,choices=DEPARTMENT_ROLE,default='Professor')
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)



    def __str__(self):
        return self.name
    


# =====================
# Official Person Model
# =====================
class OfficialPerson(models.Model):
    email = models.EmailField(unique=True)
    name=models.CharField(max_length=100,default='')
    official_role = models.CharField(max_length=100,choices=OFFICE_PERSON_ROLE,default='Electrician')
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE,default="")


    def __str__(self):
        return self.email


# =====================
# Dining/Shop/Canteen Model
# =====================
class Dining_Shop_Canteen(models.Model):
    email = models.EmailField("Official Email",unique=True)  # Usually, email should be unique
    name=models.CharField(max_length=100)
    official_role = models.CharField(max_length=100,choices=OFFICE_PERSON_ROLE,default='Electrician')

    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)



    def __str__(self):
        return self.name


# =====================
# AddOffice Model
# =====================
class AddOffice(models.Model):

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)
    password = models.CharField(max_length=100)
    blood_group = models.CharField(max_length=10)
    hall = models.ForeignKey(Hall, on_delete=models.SET_NULL, null=True, blank=True)
    user_role = models.CharField(max_length=100, choices=USER_ROLE)

    provost_body_role = models.CharField(max_length=100,choices=PROVOST_BODY_ROLE,blank=True, null=True,help_text='Only for Provost Body')

    department = models.CharField(max_length=100, blank=True, null=True)

    department_role = models.CharField(max_length=100,choices=DEPARTMENT_ROLE,blank=True, null=True,help_text='Only for Provost Body')
    official_role = models.CharField(max_length=100, choices=OFFICE_PERSON_ROLE, default='Assistant Register',blank=True, null=True,help_text='Only for Official Person')
    profile_picture = models.ImageField(upload_to='student_profile_pictures/', null=True, blank=True)


    


    def __str__(self):
        return f"{self.name} - {self.email}"

    def clean(self):
        if not self.user_role:
            raise ValidationError("User role must be provided.")
    
        if self.user_role == 'provost_body':
            if not self.provost_body_role or not self.department_role or not self.department:
                raise ValidationError("Provost body role, department role, and department must be provided for provost body.")
    
        elif self.user_role == 'official_person':
            if not self.official_role:
                raise ValidationError({'official_role': 'Official role must be selected for official person.'})
    
        elif self.user_role == 'dining_shop_canteen':
            if self.official_role not in ['dining', 'shop', 'canteen']:
                raise ValidationError({'official_role': 'Role must be either dining, shop, or canteen.'})
    

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

        with transaction.atomic():
            # Create or update UserInformation
            user_info, _ = UserInformation.objects.update_or_create(
                email=self.email,
                defaults={
                    'name': self.name,
                    'image': self.profile_picture,
                    'phone_number': self.phone_number,
                    'password': self.password,
                    'blood_group': self.blood_group,
                    'hall': self.hall,
                    'user_role': self.user_role,
                }
            )

            # Handle ProvostBody
            if self.user_role == 'provost_body':

                ProvostBody.objects.update_or_create(
                    email=self.email,
                    defaults={
                        'name':self.name,
                        'provost_body_role': self.provost_body_role,
                        'department_role': self.department_role,
                        'department': self.department,
                        'hall':self.hall
                    }
                )

            # Handle OfficialPerson
            elif self.user_role == 'official_person':


                OfficialPerson.objects.update_or_create(
                    email=self.email,
                    defaults={
                        'name':self.name,
                        'official_role': self.official_role,
                        'hall':self.hall
                    }
                ) 
            # Handle dining/shop/canteen
            elif self.user_role == 'dining_shop_canteen':


                Dining_Shop_Canteen.objects.update_or_create(
                    email=self.email,
                    defaults={
                        'name':self.name,
                        'official_role': self.official_role,
                        'hall':self.hall
                    }
                )
        # Remove this line:
        self.delete()