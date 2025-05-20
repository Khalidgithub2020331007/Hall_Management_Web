from django.contrib import admin
from .models import Event, AddFile

class AddFileInline(admin.TabularInline):
    model = AddFile
    extra = 1
    fields = ['file']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['event_name', 'event_date_time', 'event_publicist_email', 'event_publicist_email_name', 'event_publicist_email_hall']
    search_fields = ['event_name', 'event_publicist_email__email', 'event_publicist_email__name', 'event_publicist_email__hall']
    inlines = [AddFileInline]
    readonly_fields = ['event_file']

    # Add these properties on the model or here as property methods:
    def event_publicist_email_name(self, obj):
        return obj.event_publicist_email.name
    event_publicist_email_name.short_description = 'Publicist Name'

    def event_publicist_email_hall(self, obj):
        return obj.event_publicist_email.hall
    event_publicist_email_hall.short_description = 'Hall'
