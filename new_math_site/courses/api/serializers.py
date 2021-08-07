from rest_framework import serializers
from ..models import Course, Lesson
from testsApp.api.serializers import TestSerializer


class ModuleSerializer(serializers.ModelSerializer):
    module_test = TestSerializer(many=True)

    class Meta:
        model = Lesson
        fields = ['id', 'module_name', 'body', 'module_test', 'slug']


class CourseSerializer(serializers.ModelSerializer):
    course_lessons = ModuleSerializer(many=True, read_only=True)
    course_test = TestSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description',
                  'course_lessons', 'students_on_course', 'course_test']
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'},
            'students_on_course': {'required': False}
        }
