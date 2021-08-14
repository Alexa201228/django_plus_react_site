from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from ..services import TestChecker
from rest_framework import status, viewsets
from rest_framework import permissions
from rest_framework.decorators import action

from .serializers import QuestionSerializer, TestSerializer
from ..models import Question, Test


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
            test_checker = TestChecker(test, request.data)
            result = test_checker.get_test_result()
            if result[2]:
                request.user.succeded_students.append(test)
            return Response(
                {
                    'correct_answers': result[1],
                    'is_passed': result[2],
                    'finished': True
                },
                status=status.HTTP_200_OK
            )
        except AuthenticationFailed:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            raise Exception

class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Question.objects.all()