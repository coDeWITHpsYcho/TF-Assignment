from rest_framework import serializers
from .models import Profile, Account
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_photo', 'age', 'contact_number', 'employer']

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['account_type', 'current_balance']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    account = AccountSerializer(read_only=True)  # strictly non-editable

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'account']
