from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import AttachmentCreateSerializer
from .models import Attachment

class Attachment(APIView):
    serializer_class = AttachmentCreateSerializer
    querysets = Attachment.objects.all()

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            attachment = serializer.save()
            return Response({"data": self.serializer_class(attachment).data}, status=status.HTTP_201_CREATED)
        return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # def get(self, request):
    #     queryset = Attachment.objects.all()
    #     data_counter = queryset.count()

    #     content_type = request.query_params.get("content_type")
    #     object_id = request.query_params.get("object_id")
    #     attachment_type = request.query_params.get("attachment_type")

    #     if object_id:
    #         queryset = queryset.filter(object_id=object_id)
    #     if attachment_type:
    #         queryset = queryset.filter(attachment_type=attachment_type)
        
    #     serializer = AttachmentCreateSerializer(queryset, many=True)
    #     return Response({"data": serializer.data, "total_count": data_counter}, status=status.HTTP_200_OK)

    def get(self, request):
        data_counter = self.querysets.count()
        para = request.query_params.dict()
         
        content_type = request.query_params.get("content_type" , None)              
        object_id = request.query_params.get("object_id",None)
        content_object = request.query_params.get("content_object", None)
        attachment_file = request.query_params.get("attachment_file", None)
        attachment_type = request.query_params.get("attachment_type", None)
        
        
        if object_id is not None:
            querysets = self.querysets.filter(object_id=object_id)
        if attachment_type is not None:
            querysets = self.querysets.filter(attachment_type = attachment_type)
            attachment = AttachmentCreateSerializer(querysets, many = True)
            return Response(
                {"data":attachment.data, "total_count": data_counter},
                status = status.HTTP_200_OK,
            )
        attachment = AttachmentCreateSerializer(self.querysets ,many= True )
        return Response(
            {"data": attachment.data, "total_count": data_counter}, status=status.HTTP_200_OK
        )