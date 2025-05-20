from rest_framework import serializers
from .models import CreateOfficialTransaction, AddFile

class AddFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddFile
        fields = ['id', 'file']

class CreateOfficialTransactionSerializer(serializers.ModelSerializer):
    files = AddFileSerializer(many=True, read_only=True)

    class Meta:
        model = CreateOfficialTransaction
        fields = [
            'transaction_id',
            'transaction_type',
            'transaction_description',
            'transaction_amount',
            'transaction_file',
            'transaction_date_time',
            'user_email',
            'files',
        ]

class CreateOfficialTransactionCreateSerializer(serializers.ModelSerializer):
    uploaded_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = CreateOfficialTransaction
        fields = [
            'transaction_type',
            'transaction_description',
            'transaction_amount',
            'user_email',
            'uploaded_files',
        ]

    def create(self, validated_data):
        uploaded_files = validated_data.pop('uploaded_files', [])
        transaction = CreateOfficialTransaction.objects.create(**validated_data)
        for f in uploaded_files:
            AddFile.objects.create(transaction=transaction, file=f)
        return transaction
