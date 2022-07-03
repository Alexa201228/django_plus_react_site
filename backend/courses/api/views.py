from rest_framework import generics, viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework.response import Response
from pytils.translit import slugify

import jwt
import os

from ..models import Course
from accounts.models import Student, Mentor
from .serializers import *


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

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
            user_id = jwt.decode(self.request.headers.get('Authorization').replace('Bearer ', ''),
                                 os.getenv('SECRET_KEY'), algorithms=['HS256']).get('user_id')
            student = Student.objects.filter(id=user_id).first()
            course.students_on_course.add(student)
            student.student_courses.add(course)
            return Response(
                {'course': CourseSerializer(course).data},
                status=status.HTTP_202_ACCEPTED
            )
        except AuthenticationFailed as auth_fail:
            return Response(
                {'error': auth_fail.detail},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class ModuleDetailApiView(generics.RetrieveAPIView):
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        course_slug = self.kwargs.get('course_slug')
        lesson_slug = self.kwargs.get('lesson_slug')

        course = Course.objects.get(slug=course_slug)
        lesson = Lesson.objects.get(
            course_id=course.id, lesson_slug=lesson_slug)
        return lesson


class LessonViewSet(viewsets.ModelViewSet):

    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Lesson.objects.all()

    @action(
        detail=False,
        methods=['post'],
        url_path='add'
    )
    def add_new_lesson(self, request):
        """
        Method to add new lesson to course
        """
        lesson_slug = slugify(request.data['lesson_name'])
        course = Course.objects.filter(id=request.data['course']).first()
        new_lesson = Lesson.objects.create(lesson_name=request.data['lesson_name'],
                                           course_id=course,
                                           body=request.data['lesson_text'],
                                           lesson_slug=lesson_slug)
        new_lesson.save()
        return Response({})
