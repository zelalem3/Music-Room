from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):  # Use ModelSerializer
    class Meta:
        model = Room
        fields = '__all__'  # or specify the fields explicitly

    def create(self, validated_data):
        return Room.objects.create(**validated_data)