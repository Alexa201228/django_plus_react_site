from typing import Dict, List

from .models import Question, Test, Answer, TestResult
from .api.serializers import AnswerSerializer
from accounts.models import Student


class TestChecker():
    """
    Класс для проверки теста.
    Метод проверки возвращает результат в процентах,
    правильне ответы и ответы пользователя.
    Также возвращает boolean пройден или не пройден тест
    """
    def __init__(self,
                 test: Test,
                 user_answers: Dict[Question, List[Answer]],
                 user_time: int,
                 user: Student):
        self.test = test
        self.answers = user_answers
        self.user = user
        self.user_time = user_time

    def get_test_result(self) -> list:
        """
        Проверка происходит следующим образом:
        1. Получаем все вопросы, связанные с тестом
        2. Получаем все правильные ответы в виде словаря 
        ({номер вопроса: список ответов})
        3. Проверяем ответы пользователя (Ответ считается правильным
        только если пользователь отметил все правильные варианты
        в вопросах с несколькими вариантами ответа. Также
        если пользователь не ответил на вопрос, то ответ не защитывается)
        4. Расчитываем результат пользователя в процентах
        (правильные ответы пользователя/кол-во вопросов)
        5. Если результат больше или равно 80%, пользователь прошел тест
        """
        try:
            questions = self.test.questions_on_test.all()
            correct_answers: dict = {}
            user_test_result = TestResult.objects.create(user_id=self.user, test_id=self.test)
            user_test_result.test_time = self.user_time
            # Получаем правильные ответы
            for question in questions:
                user_test_result.test_questions.add(question)
                correct_answers[str(question.id)] = question.get_correct_answers()

            # Счетчик результата пользователя
            user_points = 0

            # Проверка ответов пользователя
            for answer in self.answers:
                print(self.answers, answer, correct_answers)
                if correct_answers[answer] == list(map(int, self.answers[answer])):
                    user_points += 1
                for ans in self.answers[answer]:
                    user_test_result.chosen_answers.add(ans)
            user_result: float = round(user_points/len(questions), 2) * 100

            # Проверка на прохождение теста по резултатам
            is_passed: bool = False
            if user_result >= 80:
                user_test_result.test_mark = 5
                is_passed = True
            if 70 <= user_result < 80:
                user_test_result.test_mark = 4
            if 45 <= user_result < 70:
                user_test_result.test_mark = 3
            user_test_result.is_passed = is_passed
            # Заполняем словарь правильных ответов
            returned_correct_answers = {}
            for key in correct_answers.keys():
                temp_arr = []
                for answer in correct_answers[key]:
                    temp_arr.append(
                        AnswerSerializer(
                            Answer.objects.get(pk=answer)).data
                        )
                returned_correct_answers[key] = temp_arr
            user_test_result.save()
            return [user_result, returned_correct_answers, is_passed]
        except Exception as e:
            raise e
        

