from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status

class Pagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 500

class SpecificPagination:
    pagination_class = Pagination

    def pagination_models(self, request, queryset, params, specific_serializer):
        total_jobs = queryset.count()

        # Get pagination parameters
        page = int(params.get('page', 1))
        page_size = int(params.get('page_size', self.pagination_class.page_size))

        # Calculate total number of pages
        total_pages = (total_jobs + page_size - 1) // page_size

        if page > total_pages:
            return Response(
                {"message": f"Invalid page number. The dataset only has {total_pages} pages."},
                status=status.HTTP_400_BAD_REQUEST
            )

        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        if paginated_queryset is not None:
            jobs = specific_serializer(paginated_queryset, many=True).data
            paginated_response = paginator.get_paginated_response(jobs)
            paginated_response.data['total_data'] = total_jobs
            paginated_response.data['total_pages'] = total_pages
            return paginated_response

        jobs = specific_serializer(queryset, many=True).data
        return Response(
            {"data": jobs, "total_count": total_jobs}, status=status.HTTP_200_OK
        )
