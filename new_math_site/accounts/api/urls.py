from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    path('auth/register', views.RegisterApiView.as_view(), name='register'),
    path('auth/login', views.LoginApiView.as_view(), name='login'),
    path('auth/logout', views.LogoutView.as_view(), name='logout'),
    path('auth/user', views.UserApiView.as_view()),
    path('auth/email-verify', views.VerifyEmail.as_view(), name='email-verify'),
]
