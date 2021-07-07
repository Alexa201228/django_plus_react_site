from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    path('auth/register', views.RegisterApiView.as_view()),
    path('auth/login', views.LoginApiView.as_view()),
    path('auth/logout', views.LogoutView.as_view()),
    path('auth/user', views.UserApiView.as_view()),
]
