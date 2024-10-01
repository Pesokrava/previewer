#!/bin/sh

until cd /app/server
do
    echo "Waiting for server volume..."
done
celery -A transformer worker --loglevel=info --concurrency 1 -E
