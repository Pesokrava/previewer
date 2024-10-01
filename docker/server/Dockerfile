# ---- client ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY client/package*.json ./

RUN npm i

COPY client .

RUN npm run build


# ---- server ----
FROM python:3.10-alpine

RUN apk update && apk add python3-dev gcc libc-dev

WORKDIR /app

RUN pip install --upgrade pip
RUN pip install gunicorn
ADD ./server/requirements.txt /app/
RUN pip install -r requirements.txt

ADD ./server /app/server
ADD ./docker /app/docker

COPY --from=builder /app/static /app/server/static
RUN mv ./server/static/index.html ./server/templates

RUN chmod +x /app/docker/server/server-entrypoint.sh
RUN chmod +x /app/docker/server/worker-entrypoint.sh
