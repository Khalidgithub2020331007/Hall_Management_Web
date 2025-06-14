# =================
# forum/admin.py
# =================

from django.contrib import admin
from .models import New_Forum_Post, AddFile

class AddFileInline(admin.TabularInline):
    model = AddFile
    extra = 1

@admin.register(New_Forum_Post)
class ForumAdmin(admin.ModelAdmin):
    list_display = [
        'post_id',
        'user_email',
        'user_name',
        'post_date_time',
        'file_count',
        'hall'
    ]
    search_fields = [
        'user_email__email',
        'user_email__name',
        'post_date_time',
        'user_email__hall__name'
    ]
    inlines = [AddFileInline]
    readonly_fields = ['post_date_time', 'post_files']
    list_filter = ['post_date_time', 'user_email__hall']
    ordering = ['-post_date_time']

    def hall(self, obj):
        return obj.user_email.hall
    hall.short_description = 'Hall'

    def user_name(self, obj):
        return obj.user_email.name
    user_name.short_description = 'User Name'

    def file_count(self, obj):
        return obj.files.count()
    file_count.short_description = 'Attached Files'
