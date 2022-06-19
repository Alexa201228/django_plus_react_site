from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('tests', views.TestViewSet)
router.register('questions', views.QuestionViewSet)
app_name = 'testApp'

urlpatterns = router.urls