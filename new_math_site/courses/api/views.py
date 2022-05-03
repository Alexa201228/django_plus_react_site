from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework.response import Response

from ..models import Course
from .serializers import *


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    """
    Custom function to register user on course
    from course detail page
    """
    @action(
        methods=['post'],
        detail=True,
        permission_classes=[permissions.IsAuthenticated, ])
    def enroll(self, request, *args, **kwargs):
        try:
            course = self.get_object()
            course.students_on_course.add(request.user)
            request.user.student_courses.add(course)
            return Response(status=status.HTTP_202_ACCEPTED)
        except AuthenticationFailed as auth_fail:
            return Response(
                {'error': auth_fail.detail},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            return Response(
                {'error': e},
                status=status.HTTP_400_BAD_REQUEST
            )


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]


class ModuleDetailApiView(generics.RetrieveAPIView):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        course_slug = self.kwargs.get('course_slug')
        lesson_slug = self.kwargs.get('lesson_slug')

        course = Course.objects.get(slug=course_slug)
        lesson = Lesson.objects.get(
            course_id=course.id, lesson_slug=lesson_slug)
        return lesson
