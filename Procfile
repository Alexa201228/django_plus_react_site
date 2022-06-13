release: python manage.py migrate
web: gunicorn --pythonpath new_math_site new_math_site.wsgi:application --log-file - --log-level debug
npm run build
