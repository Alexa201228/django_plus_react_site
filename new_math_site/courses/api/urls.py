from rest_framework import routers
from django.urls import path
from . import views

router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet)
router.register('lessons', views.LessonViewSet)
app_name = 'courses'

urlpatterns = router.urls + [
    path('courses/<slug:course_slug>/<slug:lesson_slug>/',
     views.ModuleDetailApiView.as_view(),
     name='lesson_detail')
]