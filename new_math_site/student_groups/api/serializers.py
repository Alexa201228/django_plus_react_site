from rest_framework import serializers

from student_groups.models import StudentGroup


class StudentGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentGroup
        fields = ['group_name']
