from django.shortcuts import render

def mainPage(request):
    return render(request, 'frontend/mainPage.html')
# Create your views here.
