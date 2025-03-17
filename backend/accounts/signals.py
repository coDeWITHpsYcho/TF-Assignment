from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile, Account

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def create_related_profiles(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        Account.objects.create(user=instance)
