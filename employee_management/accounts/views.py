from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
# Create your views here.

from django.contrib.auth import login, logout, authenticate

from .forms import UserRegistrationForm, UserProfileForm

def signup_view(request):

    if request.user.is_authenticated:
        return redirect("overview")

    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
        else:
            return render(request, 'signup.html', {"form": form})
    else:
        form = UserRegistrationForm()
        context = {'form': form}
        return render(request, 'signup.html', context)


def login_view(request):

    if request.user.is_authenticated:
        return redirect("overview")

    if request.method == "POST":
        user_name = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(username=user_name, password=password)
        if user:
            print("===== VALID USER =====")
            login(request, user)
            return redirect("overview")
        else:
            print("===== INVALID USER =====")
            form = AuthenticationForm()
            return render(request, 'login.html', {"form": form})
    else:
        form = AuthenticationForm()
        context = {"form": form}
        return render(request, 'login.html', context)


def logout_view(request):
    logout(request)
    return redirect("login")


@login_required(login_url="login")
def profile_view(request):

    if request.method == "POST":
        form = UserProfileForm(request.POST, request.FILES)
        if form.is_valid():
            print("==========")
            print(form)
            print(request.user)
            print("==========")
            form.user = request.user
            form.save()
            return redirect("overview")
        else:
            context = {"form": form}
            return render(request, 'profile.html', context)
    else:
        form = UserProfileForm()
        context = {"form": form}
        return render(request, 'profile.html', context)
    

def get_session_data(session_key):
    from django.contrib.sessions.models import Session
    session_obj = Session.objects.get(session_key=session_key)
    decoded_data = session_obj.get_decoded()
    print(decoded_data)
