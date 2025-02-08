FROM python:3.10-alpine

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
ADD . /app
WORKDIR /app
RUN uv sync --frozen

EXPOSE 80

CMD ["uv", "run", "flask", "--app", "app", "run", "--host=0.0.0.0", "--port=80"]