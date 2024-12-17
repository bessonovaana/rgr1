from django.db import models 

class Users(models.Model):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=32, null=True)
    email = models.EmailField(null=True, unique=True, max_length=32)


    class Meta:
        db_table: str = "User"

class Video(models.Model):
    video_name = models.CharField(max_length=128, blank=False)
    video_file = models.FileField(upload_to='media', blank=False)


class Comment(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')  # Связь с моделью Video по id
    text = models.TextField()
    username = models.CharField(max_length=128, blank=False, null=True)
    created_at = models.DateTimeField(auto_now_add=True)