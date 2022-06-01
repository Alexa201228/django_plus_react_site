from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from student_groups.models import StudentGroup

from .serializers import StudentGroupSerializer


class StudentGroupAPIView(viewsets.ModelViewSet,
                          viewsets.ViewSet):
    serializer_class = StudentGroupSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = StudentGroup.objects.all().order_by('start_year')

    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated],
        url_path='year'
    )
    def get_groups_by_year(self, request):
        """
        Method to get groups by start year
        """
        groups = StudentGroup.objects.filter(start_year=request.GET.get('year')).all()
        student_groups = []
        for group in groups:
            student_groups.append(StudentGroupSerializer(group).data)
        return Response({
            'groups': student_groups
        })

