from rest_framework import generics
from rest_framework import viewsets
from rest_framework import permissions
from ..models import Course
from .serializers import *


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
