from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from csvapp.views import CSVFileUploadViewSet

router = DefaultRouter()

router.register(r"csv-files", CSVFileUploadViewSet, basename="csv-file")
urlpatterns = [path("", include(router.urls))]
