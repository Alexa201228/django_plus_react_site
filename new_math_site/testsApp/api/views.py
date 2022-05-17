from django.http.response import HttpResponseBadRequest

from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from ..services import TestChecker
from rest_framework import status, viewsets
from rest_framework import permissions
from rest_framework.decorators import action

from .serializers import TestResultSerializer, QuestionSerializer, TestSerializer
from ..models import Question, Test, TestResult
from accounts.models import Student

from accounts.api.serializers import StudentSerializer


class TestViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Test.objects.all()

    """
    Метод проверки теста пользователя.
    Проверка производится в классе TestChecker
    в файле services.py
    """
    @action(
        detail=True,
        methods=['post'],
        permission_classes=[permissions.IsAuthenticated]
    )
    def test_results(self, request, *args, **kwargs):
        try:
            test = self.get_object()
            student = Student.objects.filter(email=request.user.email).first()
            print(request.data)
            test_checker = TestChecker(test, request.data['chosen_answers'], request.data['test_time'], student)
            result = test_checker.get_test_result()

            student.student_tests.add(test)
            test.students.add(student)
            return Response(
                {
                    'result': result[0],
                    'correct_answers': result[1],
                    'is_passed': result[2],
                    'finished': True
                },
                status=status.HTTP_200_OK
            )
        except AuthenticationFailed:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return HttpResponseBadRequest(f'Error type: {type(e).__name__}. Error message: {e}')

    @action(
        detail=True,
        permission_classes=[permissions.IsAuthenticated],
        methods=['get'],
        url_path='students'
    )
    def get_test_students_list(self, request, *args, **kwargs):
        test = self.get_object()
        students = []
        for student in test.students.all():
            students.append(StudentSerializer(student).data)
        return Response(
            {'students': students}
        )

    @action(
        detail=True,
        permission_classes=[permissions.IsAuthenticated],
        methods=['get'],
        url_path='students/student-result'
    )
    def get_user_test_answers(self, request, *args, **kwargs):
        student = Student.objects.filter(id=int(request.GET.get('user-id')[0])).first()
        user_test = Test.objects.filter(id=int(kwargs['pk'])).first()
        test_results = TestResult.objects.filter(user_id=student, test_id=user_test).order_by('-id').first()

        return Response(
            {
                'test_results': TestResultSerializer(test_results).data
            }
        )


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Question.objects.all()