
from django.contrib import admin
from .models import *

@admin.register(Notices)
class NoticeBoardAdmin(admin.ModelAdmin):
    list_display = (
        'notice_id',
        'notice_sender_email',
        'notice_sender_name',
        'notice_data_and_time',
        'title',
        'description',
        'file',
        'hall'
    )
    search_fields = ('notice_sender_email__email', 'title', 'description','hall__hall_name')
    def hall(self, obj):
        return obj.notice_sender_email.hall
    hall.short_description = 'Hall'

    def notice_sender_name(self, obj):
        return obj.notice_sender_email.name
    notice_sender_name.short_description = 'Sender Name'