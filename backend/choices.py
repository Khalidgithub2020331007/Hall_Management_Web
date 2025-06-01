from django.db import models, transaction
from django.core.exceptions import ValidationError, ObjectDoesNotExist
# =====================
# Role 
# =====================

USER_ROLE = [
    ('student', 'Student'),
    ('provost_body', 'Provost Body'),
    ('official_person', 'Official Person'),
    ('dining_shop_canteen', 'Dining/Shop/Canteen'),
]

PROVOST_BODY_ROLE = [
    ('provost', 'Provost'),
    ('assistant_provost', 'Assistant Provost'),
]

DEPARTMENT_ROLE = [
    ('professor', 'Professor'),
    ('associate_professor', 'Associate Professor'),
    ('assistant_professor', 'Assistant Professor'),
    ('lecturer', 'Lecturer'),
]

OFFICE_PERSON_ROLE = [
    ('assistant_register', 'Assistant Register'),
    ('administrative_officer', 'Administrative Officer'),
    ('accountant', 'Accountant'),
    ('cleaner', 'Cleaner'),
    ('electrician', 'Electrician'),
    ('plumber', 'Plumber'),
    ('gardener', 'Gardener'),
    ('office_assistant', 'Office Assistant'),
    ('office_attendant', 'Office Attendant'),
    ('guard', 'Guard'),
    ('senior_assistant', 'Senior Assistant'),
    ('dining', 'Dining'),
    ('shop', 'Shop'),
    ('canteen', 'Canteen'),
    ('others', 'Others'),
]

OUTLET_ROLE_CHOICES = [
    ('dining', 'Dining'),
    ('canteen', 'Canteen'),
    ('shop', 'Shop'),
]


# =========================
# Complaint Tags
# =========================
COMPLAIN_TAG = [
    ('water_supply', 'Water Supply'),
    ('room_clean', 'Room Clean'),
    ('toilet_clean', 'Toilet Clean'),
    ('bathroom', 'Bathroom'),
    ('electric', 'Electric'),
    ('dining', 'Dining'),
    ('shop', 'Shop'),
    ('canteen', 'Canteen'),
    ('wi_fi', 'Wi-Fi'),
    ('reading_room', 'Reading Room'),
    ('drainage_system', 'Drainage System'),
    ('bed', 'Bed'),
    ('locker', 'Locker'),
    ('window_glass', 'Window Glass'),
    ('mosquito_net_stand', 'Mosquito Net Stand'),
    ('administrative', 'Administrative'),
    ('others', 'Others'),
]

# =========================
# Student Related Choices
# =========================
STUDY_PROGRAM_CHOICES = [
    ('undergraduate', 'UnderGraduate'),
    ('graduate', 'Graduate'),
]

GENDER_CHOICES = [
    ('male', 'Male'),
    ('female', 'Female'),
]

SESSION_CHOICES = [
    ('2019', '2019-2020'),
    ('2020', '2020-2021'),
    ('2021', '2021-2022'),
    ('2023', '2023-2024'),
    ('2024', '2024-2025'),
]

SEMESTER_CHOICES = [
    ('1/1', '1/1'), ('1/2', '1/2'),
    ('2/1', '2/1'), ('2/2', '2/2'),
    ('3/1', '3/1'), ('3/2', '3/2'),
    ('4/1', '4/1'), ('4/2', '4/2'),
    ('m/1', 'M/1'), ('m/2', 'M/2'), ('m/3', 'M/3'),
]

# =========================
# Complaint Status Choices
# =========================
STATUS_CHOICES = [

    ('received', 'Received'),
    ('in_process', 'In Process'),
    ('resolved', 'Resolved'),
]
BLOOD_GROUP_CHOICES = [
    ('A+', 'A positive (A+)'),
    ('A-', 'A negative (A-)'),
    ('B+', 'B positive (B+)'),
    ('B-', 'B negative (B-)'),
    ('AB+', 'AB positive (AB+)'),
    ('AB-', 'AB negative (AB-)'),
    ('O+', 'O positive (O+)'),
    ('O-', 'O negative (O-)'),
    ('Others', 'Others'),
]
MEAL_TIME_CHOICES = [
    ('breakfast', 'Breakfast'),
    ('lunch', 'Lunch'),
    ('dinner', 'Dinner'),
]
