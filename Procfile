release: python new_math_site/manage.py migrate && python new_math_site/manage.py collectstatic --no-input
web: gunicorn --pythonpath new_math_site new_math_site.wsgi:application --log-file - --log-level debug && npm run build
