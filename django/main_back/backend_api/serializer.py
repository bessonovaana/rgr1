from  rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["username", "password", "email"]


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['video_name', 'video_file']

