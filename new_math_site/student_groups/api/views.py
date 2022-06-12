import os
from pathlib import Path

from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from student_groups.models import StudentGroup

from .serializers import StudentGroupSerializer
from accounts.api.serializers import StudentSerializer
from accounts.models import Student

from courses.models import Course

from ..services import generate_pdf_report
from testsApp.models import TestResult


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
        student_group = StudentGroup.objects.filter(group_name=request.GET.get('group-name')).first()
        db_users = Student.objects.filter(student_group=student_group).all()
        course = Course.objects.filter(slug=request.GET.get('course')).first()
        tests = []
        if course.course_test.first():
            tests.append(course.course_test.first())
        for lesson in course.course_lessons.all():
            for test in lesson.module_test.all():
                tests.append(test)
        students_marks = {}
        group_users = [StudentSerializer(student).data for student in db_users]
        for student in db_users:
            students_marks[student.id] = {}
            for test in tests:
                test_result = TestResult.objects.filter(test_id=test.id, user_id=student.id).order_by('-id').first()
                if test_result:
                    students_marks[student.id][test.id] = test_result.test_mark
                else:
                    students_marks[student.id][test.id] = 0
        return Response({
            'group_students': group_users,
            'students_marks': students_marks
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
        try:
            student_group = StudentGroup.objects.filter(group_name=request.GET.get('group-name')).first()
            db_users = Student.objects.filter(student_group=student_group).all()
            curr_course = Course.objects.filter(slug=request.GET.get('course')).first()
            headers = ['Фамилия И.О. студента']
            tests = []
            data = []
            if curr_course.course_test.first():
                headers.append(curr_course.course_test.first().title)
                tests.append(curr_course.course_test.first().id)
            for lesson in curr_course.course_lessons.all():
                for lesson_test in lesson.module_test.all():
                    headers.append(lesson_test.title)
                    tests.append(lesson_test)
            for student in db_users:
                data.append(f'{student.last_name} {student.first_name[0] if student.first_name else ""}. {student.patronymic[0] if student.patronymic else ""}.')
                for test in tests:
                    test_result = TestResult.objects.filter(test_id=test, user_id=student.id).order_by('-id').first()
                    if test_result:
                        data.append(test_result.test_mark)
                    else:
                        data.append('-')

            filename = generate_pdf_report(request.GET.get('group-name'), headers, data)
            return Response({
                'filename': filename
            })
        except Exception as e:
            return Response({
                'error': type(e).__name__
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=['delete'],
        permission_classes=[permissions.IsAuthenticated],
        url_path='group/students/reports/delete'
    )
    def delete_temp_report_file(self, request, *args, **kwargs):
        """
        Method to delete report file from server after its' download
        """
        try:
            os.remove(f'{str(Path().resolve().parent)}/frontend/public{request.GET.get("file")}')
            return Response({})
        except Exception as e:
            return Response({
                'error': type(e).__name__
            }, status=status.HTTP_400_BAD_REQUEST)



