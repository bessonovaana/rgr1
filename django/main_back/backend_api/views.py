import os
import re
from django.shortcuts import render
from rest_framework import status
from django.http import FileResponse, Http404,StreamingHttpResponse,HttpResponse

from rest_framework.views import APIView
from .models import Users
from .serializer import *
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import pdb
class UsersView(APIView):
    def get(self, request):
        output = [
            {
                "username": output.username,
                "password": output.password,
                "email": output.email
            } for output in Users.objects.all()
        ]

        return Response(output)
    
    def delete(self, request):
        Users.objects.all().delete()

    def post(self, request):
        email = request.data.get('email')  # Используем request.data для consistency
        if Users.objects.filter(email=email).exists():
            return Response({'error': 'This user already exists'}, status = '405')  # Используем Response для ошибок
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status = '201')
        
class RegistrationAPIView(APIView):

    def post(self, request):
        
        serializer = UsersSerializer(data=request.data)

        #pdb.set_trace()

        if serializer.is_valid():

            user = serializer.save()

            refresh = RefreshToken.for_user(user) # Создание Refesh и Access

            refresh.payload.update({    # Полезная информация в самом токене

                'username': user.username,
                'user_id': user.id

            })

            return Response({

                'refresh': str(refresh),

                'access': str(refresh.access_token), # Отправка на клиент

            }, status=status.HTTP_201_CREATED)
        

        return Response(status=status.HTTP_400_BAD_REQUEST)
    
class LoginAPIView(APIView):

    def post(self, request):

        #pdb.set_trace()

        data = request.data

        username = data.get('username', None)

        password = data.get('password', None)

        if username is None or password is None:

            return Response({'error': 'Нужен и логин, и пароль'},

                            status=status.HTTP_400_BAD_REQUEST)

        user = Users.objects.filter(username = username, password = password).first()

        if user is None:

            return Response({'error': 'Неверные данные'},

                            status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        refresh.payload.update({

            'user_id': user.id,

            'username': user.username

        })

        return Response({

            'refresh': str(refresh),

            'access': str(refresh.access_token),

        }, status=status.HTTP_200_OK)
    

class LogoutAPIView(APIView):

    def post(self, request):

        refresh_token = request.data.get('refresh_token') # С клиента нужно отправить refresh token

        if not refresh_token:

            return Response({'error': 'Необходим Refresh token'},

                            status=status.HTTP_400_BAD_REQUEST)

        try:

            token = RefreshToken(refresh_token)

            token.blacklist() # Добавить его в чёрный список

        except Exception as e:

            return Response({'error': 'Неверный Refresh token'},

                            status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': 'Выход успешен'}, status=status.HTTP_200_OK)
    

def file_iterator(file_path, start=0, end=None, chunk_size=8192):
    with open(file_path, 'rb') as f:
        f.seek(start)  # Переход к началу диапазона
        remaining = end - start + 1 if end else None

        while True:
            if remaining is not None and remaining <= 0:
                break
            chunk = f.read(chunk_size if remaining is None else min(chunk_size, remaining))
            if not chunk:
                break
            yield chunk
            if remaining is not None:
                remaining -= len(chunk)

class VideoUploadAPIView(APIView):
    def post(self, request):
        #pdb.set_trace()
        data = request.data
        serializer = VideoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = 201)
        print(serializer.errors)
        return Response({'error': 'Ошибка загрузки видео'})
    

    def get(self, request, id):
        try:
            video = Video.objects.get(id = id)  # Получаем объект видео по ID
        except Video.DoesNotExist:
            return HttpResponse(status=404)

        file_path = video.video_file.path

        response = StreamingHttpResponse(
            file_iterator(file_path),
            content_type='video/mp4'
        )
    
        return response
    
class VideoIDListAPIView(APIView):
    def get(self, request):
        video_ids = Video.objects.values_list('id','video_name')  # Получаем все id
        return Response(video_ids) # Преобразуем в список и возвращаем
#414n5p+1WTQCcqew/PCo3agn79s/g5grewGB+cT3fvQ=

class CommentsAPIView(APIView):
    def post(self, request, id):
        #pdb.set_trace()
        video = Video.objects.get(id = id)
        Comment.objects.create(video=video, text= request.data.get('comment'), username = request.data.get('user'))
        return Response({'status':'OK'})
    
    def get(self, request, id):
        try:
            #pdb.set_trace()
            video = Video.objects.get(id=id)
            
            comments = video.comments.all()
            
            comments_data = [{'id': comment.id, 'text': comment.text, 'created_at': str(comment.created_at)[:20], 'username': comment.username} for comment in comments]
            
            return Response(comments_data, status=status.HTTP_200_OK)
        
        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, id):
        try:
            # Получаем видео по переданному ID
            video = Video.objects.get(id=id)

            # Удаляем все комментарии, связанные с этим видео
            video.comments.all().delete()

            return Response({'status': 'Comments deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)