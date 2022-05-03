from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from student_groups.models import StudentGroup

from .serializers import StudentGroupSerializer


class StudentGroupAPIView(mixins.CreateModelMixin,
                          mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.DestroyModelMixin,
                          viewsets.ViewSet):
    serializer_class = StudentGroupSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = StudentGroup.objects.all()
