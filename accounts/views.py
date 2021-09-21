from django.shortcuts import render, redirect

from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
# Create your views here.

from django.contrib.auth import login, logout, authenticate


def signup_view(request):

    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
        else:
            return render(request, 'signup.html', {"form": form})
    else:
        form = UserCreationForm()
        context = {'form': form}
        return render(request, 'signup.html', context)


def login_view(request):
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
