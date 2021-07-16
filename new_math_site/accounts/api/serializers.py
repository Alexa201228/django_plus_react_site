from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from ..models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'student_courses']
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
        if user and user.is_active and not user.is_superuser:
            return {
                'user': user,
                'tokens': user.tokens()
            }
        raise ValidationError('Invalid credentials')
