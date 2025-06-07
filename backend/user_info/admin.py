# =====================
# user_info/admin.py
# =====================

from django.contrib import admin
from .models import *





# =============================
# USER INFORMATION ADMIN
# =============================
@admin.register(UserInformation)
class UserInformationAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'phone_number','password','user_role', 'hall', 'image')
    search_fields = ['email', 'name', 'phone_number', 'user_role', 'hall__hall_name']
    list_filter = ('user_role', 'hall')
