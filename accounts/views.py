from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect ,HttpResponse
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout

from .forms import SignupForm, SigninForm


def signin(request):
    signinform = SigninForm()
    if request.method == 'POST':
        signinform = SigninForm(request.POST)
        # if signinform.is_valid():
        #     email = request.email
        #     # email = signinform.cleaned_data['email']
        #     # password = signinform.cleaned_data['password']
        #     user = authenticate(email=email, password=password)
        #     if user is not None:
        #         login(request, user)
        #         return HttpResponseRedirect(
        #             reverse('classtime')
        #         )
        #     else:
        #         return render(request, "accounts/login.html", {
        #             "signinform": signinform
        #         })
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(email=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('classtime')
        else:
            return HttpResponseRedirect(
                reverse('signin')
            )
    return render(request, "accounts/login.html", {
        "signinform": signinform
    })


def signup(request):
    signupform = SignupForm()
    if request.method == 'POST':
        signupform = SignupForm(request.POST, request.FILES)
        if signupform.is_valid():
            user = signupform.save(commit=False)
            user.email = signupform.cleaned_data['email']
            user.save()
            return HttpResponseRedirect(
                reverse('signin')
            )

    return render(request, "accounts/signup.html", {
        "signupform": signupform
    })


def signout(request):
    logout(request)
    return HttpResponseRedirect(
        reverse('classtime')
    )