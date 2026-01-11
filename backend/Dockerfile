FROM python:3.11-slim-bookworm

WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 8080

# Change this based on your app:
# For Flask:
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080", "--workers", "1", "--timeout", "600"]
# OR if using simple Flask dev server:
# CMD ["python", "app.py"]

# For Django:
# CMD ["gunicorn", "your_project_name.wsgi:application", "--bind", "0.0.0.0:8080", "--workers", "1", "--timeout", "600"]