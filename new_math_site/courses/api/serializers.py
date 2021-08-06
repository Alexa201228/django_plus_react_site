from rest_framework import serializers
from ..models import Course, Lesson


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'module_name', 'slug']


class CourseSerializer(serializers.ModelSerializer):
    course_modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug',
                  'course_modules', 'students_on_course']
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'},
            'students_on_course': {'required': False}
        }
