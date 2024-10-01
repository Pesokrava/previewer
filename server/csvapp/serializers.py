from rest_framework import serializers


class JoinDataSerializer(serializers.Serializer):
    apiEndpoint = serializers.CharField(max_length=255)
    column = serializers.CharField(max_length=255)
    dataKey = serializers.CharField(max_length=255)
    file = serializers.CharField(max_length=255)
    newFileName = serializers.CharField(max_length=255)
