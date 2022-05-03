from rest_framework.routers import DefaultRouter
from .views import StudentGroupAPIView

router = DefaultRouter()

router.register('student_groups', StudentGroupAPIView)

app_name = 'student_groups'

urlpatterns = router.urls