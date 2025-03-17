from django.urls import path
from .views import google_login, update_profile
from . import views

urlpatterns = [
    path('google-login/', google_login),
    path('update-profile/', update_profile),
]