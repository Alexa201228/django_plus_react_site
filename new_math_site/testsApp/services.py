from typing import Dict, List

from .models import Question, Test, Answer


class TestChecker():
    """
    Класс для проверки теста.
    Метод проверки возвращает результат в процентах,
    правильне ответы и ответы пользователя.
    Также возвращает boolean пройден или не пройден тест
    """
    def __init__(self,
                test: Test,
                user_answers: Dict[Question, List[Answer]]):
        self.test = test
        self.answers = user_answers

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
        questions = self.test.questions_on_test.all()
        correct_answers: dict = {}
        #Получаем правильные ответы
        for question in questions:
            correct_answers[str(question.id)] = question.get_correct_answers()
        #Счетчик результата пользователя
        user_points = 0
        #Проверка ответов пользователя
        for answer in self.answers:
            if correct_answers[answer] == self.answers[answer]:
                user_points += 1
        user_result: float = round(user_points/len(questions), 2) * 100
        #Проверка на прохождение теста по резултатам
        is_passed: bool = False
        if user_result >= 80:
            is_passed = True

        return [user_result, correct_answers, is_passed]
        

