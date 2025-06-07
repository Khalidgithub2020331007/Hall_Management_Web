# =====================
# Official admin.py
# =====================

from django.contrib import admin
from .models import *

# =============================
# PROVOST BODY ADMIN
# =============================
@admin.register(ProvostBody)
class ProvostBodyAdmin(admin.ModelAdmin):
    list_display = ('email','name','provost_body_role', 'department_role', 'department','hall')
    search_fields = ('email','name', 'department', 'provost_body_role', 'department_role','hall')
    list_filter = ('provost_body_role', 'department_role', 'department')


# =============================
# OFFICIAL PERSON ADMIN
# =============================
@admin.register(OfficialPerson)
class OfficialPersonAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'official_role','hall')
    search_fields = ('email', 'name', 'official_role','hall')
    list_filter = ('official_role',)

# =============================
# Dining Canteen Shop ADMIN
# =============================
@admin.register(Dining_Shop_Canteen)
class DiningShopCanteenAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'official_role', 'hall')
    search_fields = ('email', 'name', 'official_role', 'hall__hall_name')
    list_filter = ('official_role', 'hall')  






# =============================
# ADD OFFICE ADMIN
# =============================
@admin.register(AddOffice)
class AddOfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'user_role', 'hall', 'blood_group')
    search_fields = ('name', 'email', 'phone_number', 'user_role', 'hall__hall_name')
    list_filter = ('user_role', 'hall')

    
    # Only include valid foreign key fields
    # raw_id_fields = ('role', 'provost_body_role', 'department_role')
