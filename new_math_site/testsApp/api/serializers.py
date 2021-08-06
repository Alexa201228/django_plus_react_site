from rest_framework import serializers
from ..models import Test, Question, Answer


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ('id', 'answer_body', 'is_correct')


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = ('id', 'question_body', 'answers')


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Test
        fields = ('id', 'questions', 'lesson', 'course')