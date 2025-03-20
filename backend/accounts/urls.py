from django.urls import path
from .views import google_login, update_profile, transfer_money, transaction_history
from . import views

urlpatterns = [
    path('google-login/', google_login),
    path('update-profile/', update_profile),
    path('transfer-money/', transfer_money, name='transfer-money'),
    path('transaction-history/<str:uid>/', transaction_history, name='transaction-history'),
]