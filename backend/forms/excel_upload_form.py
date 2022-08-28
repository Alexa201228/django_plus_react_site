from django.forms import forms


class ExcelUploadForm(forms.Form):
    upload_xlsx_file = forms.FileField()
