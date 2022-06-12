from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.auth import authenticate

from rest_framework import serializers

from ..models import User, Mentor, Student
from courses.api.serializers import CourseSerializer, TrainingDirectionSerializer
from testsApp.api.serializers import TestSerializer
from student_groups.api.serializers import StudentGroupSerializer, StudentBookNumberSerializer


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = ['email', 'password', 'first_name', 'student_group', 'student_book_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            password = validated_data.pop('password', None)
            instance = self.Meta.model(**validated_data)
            if password is not None:
                validate_password(password, instance)
                instance.set_password(password)
                instance.save()
                return instance
        except ValidationError as e:
            raise e


class StudentLoginSerializer(serializers.Serializer):

    student_book_number = serializers.CharField(error_messages={
        'blank': 'Пожалуйста введите номер зачетной книжки'
    },)
    password = serializers.CharField(error_messages={
        'blank': 'Пожалуйста введите пароль',
    },)

    class Meta:
        model = Student

    def validate(self, attrs):
        user = Student.objects.filter(
            student_book_number=attrs['student_book_number']).first()
        user_auth = check_password(attrs['password'], user.password)
        if user and user.is_active and not user.is_superuser and user_auth:
            return {
                'user': user,
                'tokens': user.tokens()
            }
        else:
            raise ValidationError('Неверны номер зачетной книжки или пароль')


class MentorLoginSerializer(serializers.Serializer):

    email = serializers.EmailField(error_messages={
        'blank': 'Пожалуйста введите свой email',
    },)
    password = serializers.CharField(error_messages={
        'blank': 'Пожалуйста введите пароль',
    },)

    class Meta:
        model = Mentor

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active and not user.is_superuser:
            return {
                'user': user,
                'tokens': user.tokens()
            }
        else:
            raise ValidationError('Неверны имя пользователя или пароль')


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(
        error_messages={
            'blank': 'Пожалуйста введите новый пароль',
        },
        write_only=True)
    confirm_password = serializers.CharField(error_messages={
        'blank': 'Пожалуйста подтвердите пароль',
    },
        write_only=True)

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs.get('email'))
            new_password = attrs.get('new_password')
            password_confirmation = attrs.get('confirm_password')
            if new_password != password_confirmation:
                raise ValidationError('Пароли не совпадают\n' +
                                      'Пожалуйста, проверьте, не включён ли CapsLock и повторите ввод')
            validate_password(new_password, user)
            user.set_password(new_password)
            user.save()
            return user
        except ObjectDoesNotExist as obj_not_exists:
            raise obj_not_exists
        except Exception as e:
            raise e


class MentorSerializer(serializers.ModelSerializer):
    mentor_courses = CourseSerializer(many=True, read_only=True, required=False)
    mentors_groups = StudentGroupSerializer(many=True, read_only=True, required=False)
    mentor_training_directions = TrainingDirectionSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Mentor
        fields = ['id', 'first_name', 'last_name', 'patronymic', 'mentor_courses',
                  'mentors_groups', 'mentor_training_directions']


class StudentSerializer(serializers.ModelSerializer):
    student_courses = CourseSerializer(many=True, read_only=True, required=False)
    student_tests = TestSerializer(many=True, read_only=True, required=False)
    student_book_number = StudentBookNumberSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'email', 'first_name', 'last_name', 'patronymic',
                  'student_courses', 'student_tests', 'student_book_number']