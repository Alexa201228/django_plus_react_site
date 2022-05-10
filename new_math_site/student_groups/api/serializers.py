from rest_framework import serializers

from student_groups.models import StudentGroup, StudentBookNumber


class StudentGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentGroup
        fields = ['group_name']


class StudentBookNumberSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentBookNumber
        fields = ['student_book_number']