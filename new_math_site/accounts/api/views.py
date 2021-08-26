from django.core.exceptions import ValidationError
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings

import jwt

from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken, BlacklistedToken
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from ..utils import EmailManager
from ..models import User


class RegisterApiView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            tokens = user.tokens()
            domain = get_current_site(request).domain
            relative_link = reverse('accounts:activate')
            activate_url = 'http://' + domain + \
                relative_link + '?token=' + tokens['access']
            email_data = {
                'email_subject': 'Activate account',
                'email_body': 'Hi, ' + user.first_name +
                '\nTo verify your email, please use this link\n' +
                activate_url,
                'user_email': user.email
            }
            EmailManager.send_email(email_data)
            return Response(
                {
                    'user': UserSerializer(
                        user,
                        context=self.get_serializer_context()).data,
                    'access_token': tokens['access'],
                    'refresh_token': tokens['refresh'],
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

                }
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
                {'email': 'Activated'},
                status=status.HTTP_200_OK
            )
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': 'Activation token is expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.exceptions.DecodeError as error:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )
