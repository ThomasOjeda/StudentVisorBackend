FROM python:3.11.4

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 --no-cache-dir install -r requirements.txt

COPY . .
