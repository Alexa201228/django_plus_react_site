from rest_framework import serializers
from ..models import Test, Question, Answer


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = ('id', 'answer_body', 'is_correct')


class QuestionSerializer(serializers.ModelSerializer):
    answer_to_question = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'question_body', 'answer_to_question')


class TestSerializer(serializers.ModelSerializer):
    questions_on_test = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ('id', 'title', 'questions_on_test', 'lesson', 'course')
        extra_kwargs = {
            'questions_on_test': {'required': False},
            'title':{'required': False, 'read_only': True},
            'lesson':{'required': False, 'read_only': True},
            'course':{'required': False, 'read_only': True}
        }