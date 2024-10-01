import sqlalchemy
from django.db import models
from sqlalchemy.orm import sessionmaker

from .env import DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER

# create a custom SQLAlchemy engine so we can save pandas dataframes directly
custom_engine_provider = lambda: sqlalchemy.create_engine(
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# db sessionmaker for
psqlsessionmaker = sessionmaker(bind=custom_engine_provider())


# simple model to keep track of created dynamic tables
class CSVTablesModel(models.Model):
    table_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
