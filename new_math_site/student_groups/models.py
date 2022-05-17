from django.db import models


class StudentGroup(models.Model):
    """
    Model for student groups
    """
    group_name = models.CharField(max_length=20, unique=True, null=False,
                                  verbose_name='Название группы')
    group_mentors = models.ManyToManyField(
        to='accounts.Mentor',
        related_name='student_groups',
        blank=True,
        verbose_name='Преаодаватели группы'
    )

    class Meta:
        verbose_name = 'Группы обучающихся'
        verbose_name_plural = 'Группы обучающихся'

    def get_students_count(self):
        return len(self.user_set.all())

    def __str__(self):
        return self.group_name


class StudentBookNumber(models.Model):
    student_book_number = models.CharField(max_length=30, null=False)
    student_group = models.ForeignKey(
        to='student_groups.StudentGroup',
        related_name='student_book_numbers',
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = 'Номер зачетной книжки'
        verbose_name_plural = 'Номера зачетных книжек'

    def __str__(self):
        return self.student_book_number