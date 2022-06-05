from django.core.exceptions import ValidationError
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

import jwt

from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken, BlacklistedToken
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    StudentLoginSerializer,
    MentorLoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    MentorSerializer,
    StudentSerializer
)
from ..utils import EmailManager
from ..models import User, Mentor, Student
from student_groups.models import StudentGroup, StudentBookNumber


def send_email_with_link(user, request, subject, message, link):
    tokens = user.tokens()
    domain = get_current_site(request).domain
    activate_url = 'http://' + domain + link + tokens['access']
    email_data = {
        'email_subject': subject,
        'email_body': 'Hi, ' + user.first_name +
        message + activate_url,
        'user_email': user.email
    }
    EmailManager.send_email(email_data)


class RegisterApiView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        try:
            student_group = StudentGroup.objects.filter(group_name__iexact=request.data['student_group']).first()
            if student_group is None:
                raise ValueError('Такой группы нет в базе!')
            student_book_number = StudentBookNumber.objects.filter(
                student_book_number=request.data['student_book_number'],
                student_group=student_group.id).first()
            if student_book_number is None:
                raise ValueError('Номер зачетной книжки не соответствует номеру группы')
            data = {
                'email': request.data['email'],
                'first_name': request.data['first_name'],
                'last_name': request.data['last_name'],
                'password': request.data['password'],
                'student_group': student_group.id,
                'student_book_number': student_book_number.id
            }
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            email_message = '\nTo verify your email, please use this link\n'
            access_url_path = '/confirm/'
            email_subject = 'Activate account'
            send_email_with_link(user, request, email_subject,
                                 email_message, access_url_path)
            return Response(
                {
                    'user': StudentSerializer(
                        user,
                        context=self.get_serializer_context()).data
                }
            )
        except ValidationError as e:
            User.objects.get(pk=user.pk).delete()
            return Response(
                e.messages,
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError as val_err:
            return Response(
                data=str(val_err),
                status=status.HTTP_400_BAD_REQUEST
            )


class StudentLoginApiView(generics.GenericAPIView):
    serializer_class = StudentLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            student_book_number = StudentBookNumber.objects.filter(
                student_book_number=request.data['student_book_number']).first()
            student = Student.objects.filter(student_book_number=student_book_number.id).first()
            if student is None:
                raise ValueError('Учащегося с данным номером зачетной книжки нет в базе.'
                                 'Пожалуйста, зарегистрируйтесь для входа в систему')
            data = {
                'student_book_number': student_book_number.id,
                'password': request.data['password']
            }
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            student = Student.objects.filter(id=user['user'].id).first()
            return Response(
                {
                    'user': StudentSerializer(student).data,
                    'access_token': user['tokens']['access'],
                    'refresh_token': user['tokens']['refresh'],
                    'is_mentor': False
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                e.messages,
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValueError as val_error:
            return Response(
                data=str(val_error),
                status=status.HTTP_404_NOT_FOUND
            )


class MentorLoginApiView(generics.GenericAPIView):
    serializer_class = MentorLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            mentor = Mentor.objects.filter(id=user['user'].id).first()
            return Response(
                {
                    'user': MentorSerializer(mentor).data,
                    'access_token': user['tokens']['access'],
                    'refresh_token': user['tokens']['refresh'],
                    'is_mentor': True
                },
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                e.messages,
                status=status.HTTP_400_BAD_REQUEST
            )


class UserApiView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get_serializer_class(self):
        mentor = Mentor.objects.filter(email=self.request.user.email).first()
        if mentor is not None:
            return MentorSerializer
        return StudentSerializer

    def get(self, *args, **kwargs):
        curr_serializer = self.get_serializer()
        user = Student.objects.filter(email=self.request.user.email).first()
        is_mentor = False
        if isinstance(curr_serializer, MentorSerializer):
            is_mentor = True
            user = Mentor.objects.filter(email=self.request.user.email).first()
        return Response(
                {
                    'user': self.get_serializer(user).data,
                    'is_mentor': is_mentor
                },
                status=status.HTTP_200_OK
            )


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        if self.request.data.get('all'):
            token: OutstandingToken
            for token in OutstandingToken.objects.filter(user=request.user):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response(status=status.HTTP_204_NO_CONTENT)
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_200_OK)


class VerifyEmailView(generics.GenericAPIView):
    """
    Класс для акивации аккаунта пользователя.
    Для проверки используется декодирование 
    jwt токена с помощью библиотеки PyJWT
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['user_id'])
            user.save()
            return Response(
                status=status.HTTP_200_OK
            )
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': 'Ссылка для активации аккаунта недействительна'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.exceptions.DecodeError:
            return Response(
                {'error': 'Невалидный токен активации'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(email=request.data)
            email_message = '\nTo verify your email, please use this link\n'
            access_url = '/confirm/'
            email_subject = 'Activate account'
            send_email_with_link(
                user, request, email_subject, email_message, access_url)

            return Response(
                {'email': 'Activation link resent'},
                status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response(
                {'error': 'Данный пользователь не зарегистрирован'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(
                {'error': 'Что-то пошло не так'},
                status=status.HTTP_400_BAD_REQUEST
            )


class SendResetPasswordEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny, ]
    serializer_class = None

    def get(self, request, *args, **kwargs):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['user_id'])
            tokens = user.tokens()
            return Response(
                {
                    'user': UserSerializer(
                        user,
                        context=self.get_serializer_context()).data,
                    'access_token': tokens['access'],
                    'refresh_token': tokens['refresh'],
                },
                status=status.HTTP_200_OK
            )
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': 'Ссылка для обновления пароля недействительна'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.exceptions.DecodeError:
            return Response(
                {'error': 'Невалидный токен'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(
                {'error': 'Что-то пошло не так'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(email=request.data)
            email_message = '\nTo reset your account password, please use this link\n'
            reset_password_url = '/reset-password/'
            email_subject = 'Reset password'
            send_email_with_link(user, request, email_subject,
                                 email_message, reset_password_url)
            return Response(
                {'resetPassword': 'Reset password link sent'},
                status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response(
                {'error': 'Пользователь не найден'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            return Response(
                {'error': 'Что-то пошло не так'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def patch(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            return Response(
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                e.messages,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as excp:
            return Response(
                excp.__dict__,
                status=status.HTTP_400_BAD_REQUEST
            )
