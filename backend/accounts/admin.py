from django.contrib import admin
from .models import Profile, Account

# Profile admin (optional if you want to customize profile view)
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'age', 'contact_number', 'employer_details')
    search_fields = ('user__username', 'contact_number')

# Account admin with edit capabilities
@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('user','email' ,'account_type', 'current_balance')  # Columns visible in list view
    search_fields = ('user__username', 'email', 'account_type')           # Search by username or account type
    list_filter = ('account_type',)                              # Filter by account type
    ordering = ('user',)
