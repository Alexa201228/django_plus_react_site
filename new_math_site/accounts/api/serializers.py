from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

from rest_framework import serializers

from ..models import User
from courses.api.serializers import CourseSerializer
from testsApp.api.serializers import TestSerializer


class UserSerializer(serializers.ModelSerializer):
    student_courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name',
                  'student_courses', 'succeded_students']
        extra_kwargs = {
            'student_courses': {'required': False}
        }


class RegisterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']
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


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(error_messages={
        'blank': 'Please enter an email address',
    },)
    password = serializers.CharField(error_messages={
        'blank': 'Please enter your password',
    },)

    class Meta:
        model = User

    def validate(self, attrs):
        user = authenticate(**attrs)
        print(user)
        if user and not user.is_verified:
            raise ValidationError('Пожалуйста, продтвердите свой email')
        if user and user.is_active and user.is_verified and not user.is_superuser:
            return {
                'user': user,
                'tokens': user.tokens()
            }
        else:
            raise ValidationError('Неверны имя пользователя или пароль')
