FROM python:3.11-slim-bookworm

WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest
COPY . .

# Change this to match your app's entry point
# For Flask:
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080", "--workers", "1"]
# For Django:
# CMD ["gunicorn", "your_project.wsgi:application", "--bind", "0.0.0.0:8080", "--workers", "1"]