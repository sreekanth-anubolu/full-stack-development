from django.shortcuts import render

from django.contrib.auth.decorators import login_required
# Create your views here.

@login_required(login_url="login")
def overview_view(request):
    print(request)
    print(request.user)
    print(request.session.session_key)
    return render(request, "index.html", {"user": request.user})


