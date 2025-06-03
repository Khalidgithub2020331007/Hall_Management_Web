# =================
# events admin.py
# =================


from django.contrib import admin
from .models import Create_Event, AddFile

class AddFileInline(admin.TabularInline):
    model = AddFile
    extra = 1
    fields = ['file']

@admin.register(Create_Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        'event_name',
        'event_date_time',
        'event_publicist_email',
        'event_publicist_email_name',
        'event_publicist_email_hall'
    ]
    search_fields = [
        'event_name',
        'event_publicist_email__email',
        'event_publicist_email__name',
        'event_publicist_email__hall__name',  # If hall is FK with name field
    ]
    inlines = [AddFileInline]
    readonly_fields = ['event_file']
    list_filter = ['event_date_time', 'event_publicist_email__hall']
    ordering = ['-event_date_time']

    def event_publicist_email_name(self, obj):
        return obj.event_publicist_email.name
    event_publicist_email_name.short_description = 'Publicist Name'

    def event_publicist_email_hall(self, obj):
        # If hall is FK, show hall name, else just show hall value
        hall = getattr(obj.event_publicist_email, 'hall', None)
        if hasattr(hall, 'name'):
            return hall.name
        return hall
    event_publicist_email_hall.short_description = 'Hall'