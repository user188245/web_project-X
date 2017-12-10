from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from .models import User


class SignupForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Email',
            'required': 'True',
        }
    ))

    name = forms.RegexField(label="Name", max_length=63,
                            regex=r'^[\w.@+-]+$',
                            help_text="필수 입력",
                            error_messages={
                                'invalid': "입력 형식이 잘못되었습니다."},
                            widget=forms.TextInput(attrs={
                                'class': 'form-control',
                                'placeholder': "Name",
                                'required': 'True',
                            }))

    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Password',
                'required': 'True',
            }
        )
    )

    password2 = forms.CharField(
        label='Password Confirmation',
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Password Confirmation',
                'required': 'True',
            }
        ),
        help_text="비밀번호 확인"
    )

    # SignupForm에 대한 기술서
    class Meta:
        model = User
        # 작성한 필드만큼 화면에 보여짐
        fields = ("email", "name", "password1", "password2")


class LoginForm(AuthenticationForm):
    email = forms.CharField(
        max_length=127,
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Email',
                'required': 'True',
            }
        )
    )

    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': 'Password',
                'required': 'True',
            }
        )
    )
