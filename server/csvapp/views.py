from typing import Any, Dict, Optional, cast

import pandas as pd
import requests
from celery.result import AsyncResult
from django.http import JsonResponse
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from csvapp.models import CSVTablesModel, custom_engine_provider, psqlsessionmaker
from csvapp.serializers import JoinDataSerializer
from csvapp.tasks import perform_merge


class CSVFileUploadViewSet(viewsets.ModelViewSet):
    QUERY = "SELECT * FROM {table_name} LIMIT %s OFFSET %s;"

    def create(self, request: Request):
        try:
            file = cast(Dict[str, Any], request.FILES)["file"]
            df = pd.read_csv(file.file)
        except Exception:
            return Response("Invalid CSV file", status=status.HTTP_400_BAD_REQUEST)

        # Create a dynamic model based on the DataFrame columns
        table_name: str = file.name.split(".")[0]
        table_name.replace("-", "_")

        # create an table from csv
        df.to_sql(table_name, custom_engine_provider(), if_exists="replace")

        table = CSVTablesModel(table_name=table_name)
        table.save()

        return Response(
            "CSV file uploaded successfully", status=status.HTTP_201_CREATED
        )

    def destroy(self, _, pk: Optional[str] = None):
        table_name = pk
        if err_res := self._check_table_name(table_name):
            return err_res

        cursor = psqlsessionmaker().connection().connection.cursor()
        cursor.execute(f"DROP TABLE IF EXISTS {table_name};")

        CSVTablesModel.objects.get(table_name=table_name).delete()
        return Response(f"File {table_name}.csv deleted", status=status.HTTP_200_OK)

    def _check_table_name(self, table_name: Optional[str]) -> Optional[Response]:
        if not (table_name):
            return Response(
                "Missing csv file name or chunk size or offset query params",
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            CSVTablesModel.objects.get(table_name=table_name)
        except CSVTablesModel.DoesNotExist:
            return Response("Invalid csv file name", status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request: Request, pk: Optional[str] = None):
        table_name = pk
        chunk_size = int(request.query_params.get("chunk_size") or 5)
        offset = int(request.query_params.get("offset") or 0)
        if err_res := self._check_table_name(table_name):
            return err_res

        formatted_query = self.QUERY.format(table_name=table_name)
        cursor = psqlsessionmaker().connection().connection.cursor()
        cursor.execute(formatted_query, (chunk_size, offset))

        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        total_rows = cursor.fetchone()[0]

        return JsonResponse({"totalRows": total_rows, "rows": rows}, safe=True)

    def list(self, _):
        csv_tables = CSVTablesModel.objects.all()
        data = data = [
            {
                "fileName": table.table_name,
            }
            for table in csv_tables
        ]
        return JsonResponse(data, safe=False)

    @action(detail=False, methods=["POST"])
    def join(self, request: Request):
        # Read the incoming request and try to load it into JoinDataRequest class
        serializer = JoinDataSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                "Missing required fields in request body",
                status=status.HTTP_400_BAD_REQUEST,
            )

        req_data = cast(Dict[str, str], serializer.validated_data)
        # Fetch the data from the api endpoint
        resp = requests.get(
            req_data["apiEndpoint"], headers={"Accept": "application/json"}
        )

        if resp.status_code >= 400 and resp.status_code < 500:
            return Response(
                f"Client side error status: {resp.status_code}",
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif resp.status_code >= 500:
            return Response(
                f"Server side error status: {resp.status_code}",
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        try:
            json_data = resp.json()
        except requests.JSONDecodeError:
            return Response(
                "Failed to decode incoming json",
                status=status.HTTP_400_BAD_REQUEST,
            )

        res = perform_merge.delay(req_data, json_data)
        return JsonResponse({"taskId": res.task_id}, status=status.HTTP_202_ACCEPTED)

    @action(detail=False, methods=["POST"])
    def task(self, request: Request):
        task_id = cast(Dict[str, str], request.data).get("taskId")
        if not task_id:
            return Response("Missing task id", status=status.HTTP_400_BAD_REQUEST)

        try:
            async_res = AsyncResult(task_id)
            task_status = async_res.state
            return JsonResponse({"status": task_status}, status=status.HTTP_200_OK)

        except Exception:
            return Response(
                "Failed to check task status",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
