from rest_framework import serializers
from ..models import Test, Question, Answer, TestResult


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'answer_body', 'is_correct', 'question')


class QuestionSerializer(serializers.ModelSerializer):
    answers_to_question = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'question_body', 'answers_to_question')


class TestSerializer(serializers.ModelSerializer):
    questions_on_test = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ('id', 'title', 'questions_on_test', 'lesson', 'course', 'students', 'attempts_amount')
        extra_kwargs = {
            'questions_on_test': {'required': False},
            'title': {'required': False, 'read_only': True},
            'lesson': {'required': False, 'read_only': True},
            'course': {'required': False, 'read_only': True}
        }


class TestResultSerializer(serializers.ModelSerializer):
    test_questions = QuestionSerializer(many=True, read_only=True)
    chosen_answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = TestResult
        fields = ('id', 'user_id', 'test_questions', 'chosen_answers', 'test_id', 'test_mark', 'test_time')