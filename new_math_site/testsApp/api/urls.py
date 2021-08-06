from rest_framework import routers, viewsets
from . import views

router = routers.DefaultRouter()
router.register('tests', views.TestViewSet)
app_name = 'testApp'

urlpatterns = router.urls