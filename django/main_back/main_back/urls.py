
from django.contrib import admin
from django.urls import path
from backend_api.views import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', UsersView.as_view(), name = 'oh shit'),
    path('registration/', RegistrationAPIView.as_view(), name='registration'),
    path('Login/', LoginAPIView.as_view(), name='Login'),
    path('upload/<int:id>/', VideoUploadAPIView.as_view(), name = "upload"),
    path('upload/', VideoUploadAPIView.as_view(), name = "upload"),
    path('id/', VideoIDListAPIView.as_view(), name = "id"),
    path('comments/<int:id>/', CommentsAPIView.as_view(), name = "comment"),
    
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)