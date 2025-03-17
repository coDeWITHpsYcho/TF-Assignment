from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth as firebase_auth
from django.contrib.auth.models import User

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

        # Create or get the user
        user, created = User.objects.get_or_create(
            username=uid,
            defaults={'email': email, 'first_name': name}
        )

        # Return readable name instead of uid
        return Response({
            'message': 'Login successful',
            'username': user.first_name,  # use first_name (the real name)
            'email': user.email
        })

    except Exception as e:
        print(e)
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
