
from django.contrib.auth.forms import UserCreationForm

from django.contrib.auth.models import User

from django import forms
from django.db import models
from .models import Profile

class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']


class UserProfileForm(forms.ModelForm):
    class Meta:
        model=Profile
        fields = ["location", "dob", "bio", "profile_pic"]