FROM python:3.9
ENV PYTHONUNBUFFERED 1
WORKDIR /new_math_site
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . /new_math_site