from django.core.exceptions import ValidationError
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

import jwt

from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken, BlacklistedToken
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer, RegisterSerializer, ResetPasswordSerializer, UserSerializer
from ..utils import EmailManager
from ..models import User


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
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            email_message = '\nTo verify your email, please use this link\n'
            access_url_path = '#/confirm/'
            email_subject = 'Activate account'
            send_email_with_link(user, request, email_subject,
                                 email_message, access_url_path)
            return Response(
                {
                    'user': UserSerializer(
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


class LoginApiView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            return Response(
                {
                    'user': UserSerializer(
                        user['user'],
                        context=self.get_serializer_context()).data,
                    'access_token': user['tokens']['access'],
                    'refresh_token': user['tokens']['refresh'],
                    'isVerified': True,

                },
                status=status.HTTP_200_OK
            )
        except ValidationError as e:
            return Response(
                e.messages,
                status=status.HTTP_400_BAD_REQUEST
            )


class UserApiView(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = LoginSerializer

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
            if not user.is_verified:
                user.is_verified = True
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
            access_url = '#/confirm/'
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
            reset_password_url = '#/reset-password/'
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
