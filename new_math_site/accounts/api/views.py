from django.core.exceptions import ValidationError

from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken, BlacklistedToken
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


class RegisterApiView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            tokens = user.tokens()
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
            return Response(
                {'errors': e.messages},
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
                {'errors': e.messages},
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
