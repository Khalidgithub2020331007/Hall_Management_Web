from django.urls import path
from .views import CreateOfficialTransactionListCreateView

urlpatterns = [
    path('transactions/', CreateOfficialTransactionListCreateView.as_view(), name='transaction-list-create'),
]


# http://127.0.0.1:8000/official_transaction/createofficialtransaction/

