from rest_framework.decorators import api_view
from django.db import models
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth as firebase_auth
from django.contrib.auth.models import User
from .models import Profile, Account, Transaction   
from django.utils import timezone
from decimal import Decimal

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
            username=name,
            defaults={'email': email, 'first_name': name}
        )

        print("User:", user)

        profile, profile_created = Profile.objects.get_or_create(user=user)
        # account creation or fetching
        account, _ = Account.objects.get_or_create(user=user)

        if not account.account_type:
            account.account_type = 'will be updated soon'
        if not account.current_balance:
            account.current_balance = 0
        account.save()

        print("Profile:", profile)

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
            }
        }

        # print('Sending user_data:', user_data)

        return Response({'message': 'Login successful', 'user': user_data})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': 'Invalid token', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

        # editables
        profile.age = request.data.get('age', profile.age)
        profile.contact_number = request.data.get('contact_number', profile.contact_number)
        profile.employer_details = request.data.get('employer_details', profile.employer_details)
        profile.save()

        # Return updated user data
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
            }
        }

        # print('Sending updated_data:', updated_data)

        return Response({'message': 'Profile updated successfully', 'user': updated_data}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def transfer_money(request):
    sender_email = request.data.get('sender_email')
    recipient_email = request.data.get('recipient_email')
    amount = request.data.get('amount')

    print("Sender:", sender_email)
    print("Recipient:", recipient_email)

    # Validate required fields
    if not all([sender_email, recipient_email, amount]):
        return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    print("Amount:", amount)

    try:
        amount = Decimal(amount)

        sender = Account.objects.get(email=sender_email)
        recipient = Account.objects.get(email=recipient_email)

        print("Sender:", sender)
        print("Recipient:", recipient)

        sender_account = Account.objects.filter(email=sender_email).first()
        recipient_account = Account.objects.filter(email=recipient_email).first()

        print("Sender Account:", sender_account)
        print("Recipient Account:", recipient_account)

        if not sender_account:
            return Response({'error': 'Sender account not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not recipient_account:
            return Response({'error': 'Recipient account not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check balance
        if sender_account.current_balance < amount:
            return Response({'error': 'Insufficient balance.'}, status=status.HTTP_400_BAD_REQUEST)

        sender_account.current_balance -= amount
        recipient_account.current_balance += amount
        sender_account.save()
        recipient_account.save()

        Transaction.objects.create(
            sender=sender_account.user,
            recipient=recipient_account.user,
            amount=amount,
            timestamp=timezone.now()
        )

        return Response({'message': 'Transaction successful.'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print("Transfer Error:", e)
        return Response({'error': 'An error occurred during the transaction.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def transaction_history(request, uid):
    try:
        user = User.objects.get(username=uid)
        
        transactions = Transaction.objects.filter(
            models.Q(sender=user) | models.Q(recipient=user)
        ).order_by('-timestamp')

        history = []
        for txn in transactions:
            txn_type = 'Sent' if txn.sender == user else 'Received'
            counterparty_email = txn.recipient.email if txn.sender == user else txn.sender.email

            history.append({
                'transaction_type': txn_type,
                'counterparty_email': counterparty_email,
                'amount': float(txn.amount),
                'timestamp': txn.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            })

        return Response({'transactions': history}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
