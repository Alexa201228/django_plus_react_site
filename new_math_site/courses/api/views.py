from rest_framework import generics
from rest_framework import viewsets
from ..models import Course
from .serializers import *


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer



class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

