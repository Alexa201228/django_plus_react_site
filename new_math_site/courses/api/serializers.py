from rest_framework import serializers
from ..models import Course, Lesson
from testsApp.api.serializers import TestSerializer


class ModuleSerializer(serializers.ModelSerializer):
    module_test = TestSerializer(many=True)

    class Meta:
        model = Lesson
        extra_kwargs = {
            'url': {'lookup_field': 'lesson_slug'}
        }
        lookup_field = 'lesson_slug'
        fields = ['id', 'lesson_name', 'body', 'course_id', 'lesson_slug','module_test']


class CourseSerializer(serializers.ModelSerializer):
    course_lessons = ModuleSerializer(many=True, read_only=True)
    course_test = TestSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description',
                  'course_lessons', 'course_test']
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'}
        }
