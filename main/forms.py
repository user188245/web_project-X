from django import forms
from .models import Semester


class CreateSemester(forms.ModelForm):
    semester_name = forms.RegexField(
        label="학기 이름",
        max_length=31,
        regex=r'^[\d]{4}년 [\w\d가-힣.-]+학기$',
        error_messages={'invalid': '입력 형식이 잘못되었습니다.'},
        widget=forms.TextInput(
            attrs={
                'class': 'form-control',
                'placeholder': '○○○○년 ●●학기',
                'required': 'True',
            }))
    start_day = forms.DateField(
        label="개강일",
        widget=forms.DateInput(
            attrs={
                'class': 'form-control',
                'type': 'date',
                'required': 'True'
            }))
    end_day = forms.DateField(
        label="종강일",
        widget=forms.DateInput(
            attrs={
                'class': 'form-control',
                'type': 'date',
                'required': 'True'
            }))

    class Meta:
        model = Semester
        fields = ('semester_name', 'start_day', 'end_day')
