#!/bin/sh

# Make migrations and migrate the database
echo "Making migrations and migrating the database."

python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start the command passed by Docker
exec "$@"
