from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

from ..models import User


class RegisterApiView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user).access_token
        print(token)
        return Response(
            {
                'user': UserSerializer(
                    user,
                    context=self.get_serializer_context()).data,
                'token': str(token)
            }
        )


class LoginApiView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token = RefreshToken.for_user(user).access_token
        return Response(
            {
                'user': UserSerializer(
                    user,
                    context=self.get_serializer_context()).data,
                'token': str(token)
            }
        )


class UserApiView(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class BlackListTokenView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny,]

    def post(self, request):
        try:
            refresh_token = request.data['token']
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
