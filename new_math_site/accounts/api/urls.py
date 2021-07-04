from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    path('auth/register', views.RegisterApiView.as_view()),
    path('login', views.LoginApiView.as_view()),
]
