from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import User


class SignupForm(UserCreationForm):
    email = forms.EmailField(
        label='이메일',
        required=True,
        widget=forms.EmailInput(
            attrs={
                'class': 'form-control',
                'required': 'True',
            }
        ))

    username = forms.RegexField(
        label="이름",
        max_length=63,
        regex=r'^[\w .-]+$',
        error_messages={'invalid': '입력 형식이 잘못되었습니다.'},
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': '공백, -, . 입력 가능',
                'required': 'True',
            }))

    password1 = forms.CharField(
        label='비밀번호',
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': '최소 8자 이상(영문포함)',
                'required': 'True',
            }))

    password2 = forms.CharField(
        label='비밀번호 확인',
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'placeholder': '위의 비밀번호와 같게 입력하세요',
                'required': 'True',
            }
        ),
        help_text="비밀번호 확인"
    )

    # SignupForm에 대한 기술서
    class Meta:
        model = User
        # 작성한 필드만큼 화면에 보여짐
        fields = ('email', 'username', 'password1', 'password2')


# class SigninForm(AuthenticationForm):
class SigninForm(forms.ModelForm):
    email = forms.EmailField(
        label='EMAIL',
        max_length=127,
        widget=forms.EmailInput(
            attrs={
                'class': 'form-control',
                'required': 'True',
            }
        )
    )

    password = forms.CharField(
        label='PASSWORD',
        widget=forms.PasswordInput(
            attrs={
                'class': 'form-control',
                'required': 'True',
            }
        )
    )

    class Meta:
        model = User
        fields = ('email', 'password')
