from django.urls import path 

from . import views
urlpatterns = [
    path("", views.overview_view, name="overview")
]
