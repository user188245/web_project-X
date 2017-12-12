from django.shortcuts import render, reverse
from django.http import HttpResponseRedirect


def classtime(request):
    if request.user.is_authenticated:
        return render(request, "main/index.html")
    else:
        return HttpResponseRedirect(
            reverse('signin')
        )