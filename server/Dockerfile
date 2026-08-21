FROM python:3.12.0-slim-bookworm

ENV PYTHONBUFFERED=1
ENV PYTHONWRITEBYTECODE=1

ENV APP=/app

# Change the working directory
WORKDIR $APP

# Copy requirements file
COPY requirements.txt $APP/

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . $APP/

# Expose Django/Gunicorn port
EXPOSE 8000

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

# Run entrypoint script
ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]

# Start Django using Gunicorn
CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
