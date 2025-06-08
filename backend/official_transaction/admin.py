from django.contrib import admin
from .models import CreateOfficialTransaction, AddFile

class AddFileInline(admin.TabularInline):
    model = AddFile
    extra = 1
    # readonly_fields = ['file']

@admin.register(CreateOfficialTransaction)
class CreateOfficialTransactionAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_type', 
        'transaction_amount', 
        'user_email', 
        'user_name', 
        'user_hall', 
        'transaction_date_time'
    ]
    list_filter = ['transaction_type', 'transaction_date_time']
    search_fields = [
        'transaction_type', 
        'user_email__email', 
        'user_email__name', 
        'user_email__hall__hall_name'  # Adjust if hall has a different attribute
    ]
    readonly_fields = ['transaction_file', 'transaction_date_time']
    inlines = [AddFileInline]

    def user_name(self, obj):
        return obj.user_email.name
    user_name.short_description = 'User Name'

    def user_hall(self, obj):
        return obj.user_email.hall
    user_hall.short_description = 'User Hall'


# http://127.0.0.1:8000/admin/registration/application/add/