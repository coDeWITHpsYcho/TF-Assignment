from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    age = models.IntegerField(null=True, blank=True)
    contact_number = models.CharField(max_length=20, null=True, blank=True)
    employer_details = models.TextField(null=True, blank=True)
    profile_picture = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
    
def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/profile_photos/<user_id>/<filename>
    return f'profile_photos/{instance.user.id}/{filename}'

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    account_type = models.CharField(max_length=50, choices=(('Savings', 'Savings'), ('Current', 'Current')), default='Savings')
    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username} - {self.account_type}"