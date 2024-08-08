FROM python:3.12-alpine

COPY *.py .
COPY dist dist
COPY requirements.txt .

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["flask", "--app", "app", "run", "--host=0.0.0.0"]