from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
# Create your views here.

from .forms import SignupForm


def signin(request):
    return render(request, "accounts/login.html")


def signup(request):
    signupform = SignupForm()
    if request.method == "POST":
        signupform = SignupForm(request.POST, request.FILES)
        if signupform.is_valid():
            user = signupform.save(commit=False)
            user.email = signupform.cleaned_data['email']
            user.save()
            return HttpResponseRedirect(
                reverse("ok")
            )

    return render(request, "accounts/signup.html", {
        "signupform": signupform,
    })