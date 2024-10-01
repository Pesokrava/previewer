import os

DEBUG_MODE = bool(os.environ.get("DEBUG", False))
DB_USER = os.environ["DATABASE_USER"]
DB_HOST = os.environ["DATABASE_HOST"]
DB_NAME = os.environ["DATABASE_NAME"]
DB_PASSWORD = os.environ["DATABASE_PASSWORD"]
DB_PORT = os.environ["DATABASE_PORT"]
