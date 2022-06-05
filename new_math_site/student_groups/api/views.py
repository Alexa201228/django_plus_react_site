from rest_framework import viewsets, mixins, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from student_groups.models import StudentGroup

from .serializers import StudentGroupSerializer
from accounts.api.serializers import StudentSerializer
from accounts.models import Student

from courses.models import Course

from ..services import generate_pdf_report


class StudentGroupAPIView(viewsets.ModelViewSet,
                          viewsets.ViewSet):
    serializer_class = StudentGroupSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = StudentGroup.objects.all().order_by('start_year')

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated],
        url_path='year'
    )
    def get_groups_by_year(self, request):
        """
        Method to get groups by start year
        """
        groups = StudentGroup.objects.filter(start_year=request.GET.get('year')).all()
        student_groups = []
        for group in groups:
            student_groups.append(StudentGroupSerializer(group).data)
        return Response({
            'groups': student_groups
        })

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[permissions.IsAuthenticated],
        url_path='group/students'
    )
    def get_groups_students(self, request, *args, **kwargs):
        """
        Method to get all students of particular group
        """
        print(request.GET.get('group-name'))
        student_group = StudentGroup.objects.filter(group_name=request.GET.get('group-name')).first()
        db_users = Student.objects.filter(student_group=student_group).all()
        group_users = [StudentSerializer(student).data for student in db_users]
        return Response({
            'group_students': group_users
        })

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[permissions.IsAuthenticated],
        url_path='group/students/report'
    )
    def get_group_report(self, request, *args, **kwargs):
        """
        Method to generate a report on group
        """
        student_group = StudentGroup.objects.filter(group_name=request.GET.get('group-name')).first()
        db_users = Student.objects.filter(student_group=student_group).all()
        curr_course = Course.objects.filter(title=request.GET.get('course')).first()
        headers = ['Фамилия И.О. студента']
        tests = []
        data = []
        if curr_course.course_test.first():
            headers.append(curr_course.course_test.first().title)
            tests.append(curr_course.course_test.first().id)
        for lesson in curr_course.course_lessons.all():
            for lesson_test in lesson.module_test.all():
                tests.append(lesson_test)
        for student in db_users:
            data.append(f'{student.last_name} {student.first_name[0]}. {student.patronymic[0]}.')
            for test in tests:
                if test.id in student.student_tests:
                    data.append('Пройден')
                else:
                    data.append('-')
        filename = generate_pdf_report(request.GET.get('group-name'), headers, data)
        return Response({
            'filename': filename
        })


