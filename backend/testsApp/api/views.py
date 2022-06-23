import logging

from django.http.response import HttpResponseBadRequest

from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from ..services import TestChecker
from rest_framework import status, viewsets
from rest_framework import permissions
from rest_framework.decorators import action

from .serializers import TestResultSerializer, QuestionSerializer, TestSerializer
from ..models import Question, Test, TestResult, Answer
from accounts.models import Student

from accounts.api.serializers import StudentSerializer

from courses.models import Lesson, Course


logger = logging.getLogger(__name__)


class TestViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Test.objects.all()

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[permissions.IsAuthenticated]
    )
    def test_results(self, request, *args, **kwargs):
        """
            Метод проверки теста пользователя.
            Проверка производится в классе TestChecker
            в файле services.py
        """
        try:
            test = self.get_object()
            student = Student.objects.filter(id=request.data['user_id']).first()
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
        methods=['get'],
        url_path='get-test',
        permission_classes=[permissions.IsAuthenticated]
    )
    def get_test_checking_attempts(self, request, *args, **kwargs):
        """
        Method to get test with checking whether student have some attempts left
        """
        try:
            print('test attempt')
            logger.info('test attempt')
            logger.debug('test attempt')
            student = Student.objects.filter(id=request.GET.get('user-id')).first()
            test = self.get_object()
            student_results = TestResult.objects.filter(test_id=test, user_id=student).all()
            if len(student_results) > test.attempts_amount:
                return Response({
                    'error': f'Вы не можете пройти тест так как количество попыток исчерпано.\n'
                             f'Количество попыток: {len(student_results)}/{test.attempts_amount}'
                }, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'test': TestSerializer(test).data
            })
        except Exception as e:
            return Response({
                'error': type(e).__name__
            }, status=status.HTTP_400_BAD_REQUEST)

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
            if student.student_group.group_name == request.GET.get('group'):
                students.append(StudentSerializer(student).data)
        return Response(
            {'students': students}
        )

    @action(
        detail=True,
        permission_classes=[permissions.IsAuthenticated],
        methods=['get'],
        url_path='try-again'
    )
    def try_test_again(self, request, *args, **kwargs):
        """
        Method to let user try test again.
        If user attempts amount exceeds attempts amount of the test -
        throw error. Otherwise let user try to pass test.
        """

        test = self.get_object()
        user = Student.objects.filter(id=self.request.user.id).first()
        user_attempts = TestResult.objects.filter(test_id=test, user_id=user).all()
        if len(user_attempts) + 1 > test.attempts_amount:
            return Response({
                'error': f'Вы израходовали все попытки прохождения теста.\n'
                         f'Количество попыток: {len(user_attempts)} из {test.attempts_amount}'
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'test': TestSerializer(test).data
        })

    @action(
        detail=True,
        permission_classes=[permissions.IsAuthenticated],
        methods=['get'],
        url_path='students/student-result'
    )
    def get_user_test_answers(self, request, *args, **kwargs):
        student = Student.objects.filter(id=request.GET.get('user-id')).first()
        test = self.get_object()
        test_results = TestResult.objects.filter(test_id=test, user_id=student).order_by('-id').first()
        return Response(
            {
                'test_results': TestResultSerializer(test_results).data
            }
        )

    @action(
        detail=True,
        permission_classes=[permissions.IsAuthenticated],
        methods=['get'],
        url_path='attempts/students'
    )
    def get_all_students_test_results(self, request, *args, **kwargs):
        """
        Method to get all test results of particular student.
        Student id is provided with query parameters
        """
        test = self.get_object()
        student = Student.objects.filter(id=request.GET.get('user-id')).first()
        db_test_results = TestResult.objects.filter(test_id=test, user_id=student).all()
        results = [TestResultSerializer(test_result).data for test_result in db_test_results]
        return Response({
            'test_results': results,
            'test_users': [StudentSerializer(student).data]
        })

    @action(
        detail=False,
        methods=['post', 'patch'],
        url_path='add-edit',
        permission_classes=[permissions.IsAuthenticated]
    )
    def add_or_edit_new_test(self, request):
        """
        Method to add new test or edit existing one from frontend
        """
        try:
            if request.method == 'PATCH':
                new_test = Test.objects.filter(id=request.data.pop('test_id')).first()
                for question in new_test.questions_on_test.all():
                    question.delete()
            if request.method == 'POST':
                if request.data.get('lesson_id'):
                    lesson = Lesson.objects.filter(id=request.data.pop('lesson_id')).first()
                    exist_test = Test.objects.filter(lesson=lesson).first()
                    if exist_test:
                        raise ValueError('Тест для данного урока уже существует!')
                    new_test = Test.objects.create(lesson=lesson)
                if request.data.get('course_id'):
                    course = Course.objects.filter(id=request.data.pop('course_id')).first()
                    exist_test = Test.objects.filter(course=course).first()
                    if exist_test:
                        raise ValueError('Тест для данного курса уже существует!')
                    new_test = Test.objects.create(course=course)
            new_test.title = request.data.pop('test_name')
            new_test.attempts_amount = request.data.pop('attempts_amount')
            for question in request.data:

                new_question = Question.objects.create(test=new_test, question_body=request.data[question]['question'])
                new_question.save()
                for answer in request.data[question]['answers']:
                    is_correct = request.data[question]['answers'][answer]['isCorrect'] == 'true' \
                        if isinstance(request.data[question]['answers'][answer]['isCorrect'], str) else request.data[question]['answers'][answer]['isCorrect']
                    question_answers = Answer.objects.create(question=new_question,
                                                             answer_body=request.data[question]['answers'][answer]['answer'],
                                                             is_correct=is_correct)
                    question_answers.save()
            new_test.save()
            return Response({
                'test': TestSerializer(new_test).data
            })
        except Exception as e:
            logger.error(e)
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Question.objects.all()

