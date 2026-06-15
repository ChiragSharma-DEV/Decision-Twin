FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Render injects PORT at runtime; default to 8080 for local Docker use
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
