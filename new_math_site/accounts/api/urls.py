from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    path('auth/register', views.RegisterApiView.as_view(), name='register'),
    path('auth/login', views.LoginApiView.as_view(), name='login'),
    path('auth/logout', views.LogoutView.as_view(), name='logout'),
    path('auth/user', views.UserApiView.as_view()),
    path('auth/activate/',
         views.VerifyEmailView.as_view(), name='activate'),
    path('auth/send-reset-password-link/',
         views.SendResetPasswordEmailView.as_view(), name='send-reset-password-link'),
     path('auth/reset-password', views.ResetPasswordView.as_view(),
     name='reset-password'),
]
