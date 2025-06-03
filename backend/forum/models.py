# =================
# forum models.py
# =================


from django.core.exceptions import ValidationError
from django.db import models
from registration.models import UserInformation

class New_Forum_Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    user_email = models.ForeignKey(
        UserInformation,
        on_delete=models.CASCADE,
        related_name='forum_posts'
    )
    post_date_time = models.DateTimeField(auto_now_add=True)
    text_message = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='forum/', blank=True, null=True)
    

    def clean(self):
        if not self.text_message and not self.file:
            raise ValidationError("Either a text message or a file must be provided.")

    def __str__(self):
        return f"Post {self.post_id} by {self.user_email.email}"
