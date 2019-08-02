from django.forms import ModelForm,Form
from .models import *
from django.forms import PasswordInput,CharField,Textarea,TextInput
from django.core.exceptions import ValidationError
from django import forms
from django.contrib.auth import authenticate

class Zhuce(ModelForm):
    username = CharField(label='账户名',widget=TextInput(attrs={'placeholder':"您的用户名"}),error_messages={'required':u'账号重复'})
    password = CharField(widget=PasswordInput(attrs={'placeholder':"请输入密码"}),label='密码')
    class Meta:
        model = User
        fields = ['username','password']
        widgets = {
            'password': PasswordInput
        }
        labels = {
            'username': '用户名',
            'password': '密码',
        }
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("name",None)
        username_list = User.objects.all().values_list('username')
        if username:
            for i in username_list:
                if username in i:
                    raise ValidationError(
                        '用户名已存在，请重新输入'
                    )
        return cleaned_data

class Login(Form):
    username = CharField(label='用户名',widget=TextInput(attrs={'placeholder':"您的用户名"}))
    password = CharField(widget=PasswordInput(attrs={'placeholder':"请输入密码"}),label='密码')
    class Meta:
        model = User
        fields = ['username','password']
        widgets = {
            'password': PasswordInput
        }
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username',None)
        password = cleaned_data.get('password',None)
        if username and password:
            user=authenticate(username=username,password=password)
            if not user:
                raise ValidationError('用户名密码错误')
            else:
                self.user=user
