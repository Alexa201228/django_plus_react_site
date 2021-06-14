from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    path('courses/',
        views.CourseListView.as_view(),
        name='course_list'),
    path('courses/<pk>/',
        views.CourseDetailView.as_view(),
        name='course_detail'),
]