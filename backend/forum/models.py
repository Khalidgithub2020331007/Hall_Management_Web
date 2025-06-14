# =================
# forum/models.py
# =================

from django.core.exceptions import ValidationError
from django.db import models, transaction
from storages.backends.s3boto3 import S3Boto3Storage
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *


class New_Forum_Post(models.Model):
    """
    Represents the main forum post, containing the text content and a list
    of associated files stored in MinIO.
    """
    post_id = models.AutoField(primary_key=True)
    user_email = models.ForeignKey(
        UserInformation,
        on_delete=models.CASCADE,
        related_name='forum_posts'
    )
    post_date_time = models.DateTimeField(auto_now_add=True)
    text_message = models.TextField(blank=True, null=True)
    post_files = models.JSONField(default=list, blank=True, null=True)

    def add_file(self, file_path: str):
        """
        Helper method to add a file path to the JSONField list.
        This is called by the AddForumFile model after a successful upload.
        """
        file_path = file_path.strip()
        if self.post_files is None:
            self.post_files = []
        if file_path not in self.post_files:
            self.post_files.append(file_path)
            self.save(update_fields=['post_files'])

    def clean(self):
        """
        Ensures a post is not empty. It must have either text or an
        associated file. Note: This check works best *after* a file
        has already been uploaded and associated.
        """
        if not self.text_message and not self.post_files:
            raise ValidationError("A post must contain either a text message or a file.")

    def __str__(self):
        return f"Post {self.post_id} by {self.user_email.email}"


class AddFile(models.Model):
    """
    A helper model to handle the direct upload of a file to MinIO
    and associate it with a specific ForumPost.
    """
    post = models.ForeignKey(New_Forum_Post, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='forum/')

    def __str__(self):
        return f"File for Post {self.post.post_id} - {self.file.name}"

    def save(self, *args, **kwargs):
        """
        Custom save method to force the upload to MinIO storage.
        """
        self.file.storage = S3Boto3Storage()

        self.full_clean()
        with transaction.atomic():
            super().save(*args, **kwargs)
            self.post.add_file(self.file.name)
