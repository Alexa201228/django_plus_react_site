web: gunicorn --pythonpath new_math_site new_math_site.wsgi --log-file - --log-level debug
web: python manage.py migrate
npm run build --force