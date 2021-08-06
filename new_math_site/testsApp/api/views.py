from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions

from .serializers import TestSerializer
from ..models import Test


class TestViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Test.objects.all()
