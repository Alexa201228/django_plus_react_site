release: python manage.py migrate
web: gunicorn --pythonpath new_math_site new_math_site.wsgi --log-file - --log-level debug