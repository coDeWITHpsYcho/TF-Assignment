from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth as firebase_auth
from django.contrib.auth.models import User
from .models import Profile, Account

@api_view(['POST'])
def google_login(request):
    id_token = request.data.get('idToken')
    if not id_token:
        return Response({'error': 'No ID token provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Verify the token
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name')
        picture = decoded_token.get('picture')

        # Create or get the user
        user, created = User.objects.get_or_create(
            username=uid,
            defaults={'email': email, 'first_name': name}
        )

        profile, profile_created = Profile.objects.get_or_create(user=user)
        account, _ = Account.objects.get_or_create(user=user)

        # If the profile picture is empty, update it
        if profile_created or not profile.profile_picture:
            profile.profile_picture = picture
        if not profile.age:
            profile.age = 0
        if not profile.contact_number:
            profile.contact_number = ''
        if not profile.employer_details:
            profile.employer_details = ''

        profile.save()

        user_data = {
            'username': user.username,
            'name': user.first_name,
            'email': user.email,
            'profile_picture': profile.profile_picture,
            'age': profile.age,
            'contact_number': profile.contact_number,
            'employer_details': profile.employer_details,
            'account': {
                'account_type': account.account_type,
                'current_balance': account.current_balance
            } if account else None
        }

        print('Sending user_data:', user_data)

        return Response({'message': 'Login successful', 'user': user_data})

    except Exception as e:
        print(e)
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
def update_profile(request):
    uid = request.data.get('uid')  # Firebase UID

    if not uid:
        return Response({'error': 'UID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the user by UID
        user = User.objects.get(username=uid)
        profile = Profile.objects.get(user=user)
        account, _ = Account.objects.get_or_create(user=user)

        # Update profile fields (these fields are editable by user)
        profile.age = request.data.get('age', profile.age)
        profile.contact_number = request.data.get('contact_number', profile.contact_number)
        profile.employer_details = request.data.get('employer_details', profile.employer_details)
        profile.save()

        # Return updated user data INCLUDING account info (non-editable by user)
        updated_data = {
            'username': user.username,
            'name': user.first_name,
            'email': user.email,
            'profile_picture': profile.profile_picture,
            'age': profile.age,
            'contact_number': profile.contact_number,
            'employer_details': profile.employer_details,
            'account': {
                'account_type': account.account_type,
                'current_balance': account.current_balance
            } if account else None
        }

        print('Sending updated_data:', updated_data)

        return Response({'message': 'Profile updated successfully', 'user': updated_data}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
