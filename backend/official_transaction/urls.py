from django.urls import path
from .views import CreateOfficialTransactionListCreateView

urlpatterns = [
    path('transactions/', CreateOfficialTransactionListCreateView.as_view(), name='transaction-list-create'),
]
