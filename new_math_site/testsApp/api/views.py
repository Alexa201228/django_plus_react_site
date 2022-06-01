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
            if student.student_group.group_name == request.GET.get('group'):
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

    @action(
        detail=False,
        methods=['post'],
        url_path='add',
        permission_classes=[permissions.IsAuthenticated]
    )
    def add_new_test(self, request):
        """
        Method to add new test from frontend
        """
        print(request.data)
        if request.data.get('lesson_id'):
            lesson = Lesson.objects.filter(id=request.data.pop('lesson_id')).first()
            new_test = Test.objects.create(lesson=lesson)
        if request.data.get('course_id'):
            course = Course.objects.filter(id=request.data.pop('course_id')).first()
            new_test = Test.objects.create(course=course)
        new_test.title = request.data.pop('test_name')
        new_test.attempts_amount = request.data.pop('attempts_amount')

        for question in request.data:
            print(question, request.data[question]['question'])

            new_question = Question.objects.create(test=new_test, question_body=request.data[question]['question'])
            new_question.save()
            for answer in request.data[question]['answers']:
                print(answer)
                question_answers = Answer.objects.create(question=new_question,
                                                         answer_body=request.data[question]['answers'][answer]['answer'],
                                                         is_correct=request.data[question]['answers'][answer]['isCorrect'])
                question_answers.save()
        new_test.save()
        return Response({})


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Question.objects.all()