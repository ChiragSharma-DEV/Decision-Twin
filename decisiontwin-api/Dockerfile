FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# start.py reads $PORT from the environment at runtime — works reliably on Render.
CMD ["python", "start.py"]
