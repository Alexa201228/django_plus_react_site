import os.path
import sys

from django.contrib import admin

import nested_admin
from django.shortcuts import render
from django.urls import path

from .models import Test, Question, Answer

sys.path.insert(0, '..')
from backend.forms.excel_upload_form import ExcelUploadForm


class AnswerInline(nested_admin.NestedStackedInline):
    model = Answer
    extra = 1


class QuestionInline(nested_admin.NestedStackedInline):
    model = Question
    extra = 1
    inlines = [AnswerInline]


@admin.register(Test)
class TestsAdmin(nested_admin.NestedModelAdmin):
    change_form_template = "admin/testsApp/test/add/custom_change_form.html"

    list_display = ('title', )
    autocomplete_fields = ['lesson', 'course', 'students']
    readonly_fields = ['students']
    inlines = [QuestionInline]

    def get_urls(self):
        urls = super().get_urls()
        new_urls = [path('upload-xlsx/', self.upload_xlsx), ]
        return new_urls + urls

    def upload_xlsx(self, request):
        """
        Method to save test from xlsx (Excel) file
        into database
        """
        if request.method == 'POST':
            xlsx_file = request.FILES['upload_xlsx_file']
            print(xlsx_file)
        form = ExcelUploadForm()
        data = {'form': form}
        return render(request, 'admin/xlsx_upload.html', data)
# Register your models here.
