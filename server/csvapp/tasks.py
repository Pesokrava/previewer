from typing import Any, Dict

import pandas as pd
from celery import shared_task

from csvapp.models import CSVTablesModel, custom_engine_provider


@shared_task()
def perform_merge(details: Dict[str, str], api_data: Dict[str, Any]):
    file_df = pd.read_sql_table(details["file"], custom_engine_provider())
    api_df = pd.json_normalize(api_data)

    merged_df = pd.merge(
        file_df,
        api_df,
        left_on=details["column"],
        right_on=details["dataKey"],
        how="left",
    )

    merged_df.to_sql(
        details["newFileName"], custom_engine_provider(), if_exists="replace"
    )
    table = CSVTablesModel(table_name=details["newFileName"])
    table.save()
