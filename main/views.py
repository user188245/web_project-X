from django.shortcuts import render
# Create your views here.


def classtime(request):
    return render(request, "main/index.html");