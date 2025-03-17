from django.urls import path
from .views import google_login
from . import views

urlpatterns = [
    path('google-login/', google_login),
    path('update-profile/', views.update_profile),
]