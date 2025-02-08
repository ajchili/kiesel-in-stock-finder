FROM ghcr.io/astral-sh/uv:python3.10-bookworm-slim

RUN useradd -ms /bin/sh -u 1001 app
USER app

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a mounted volume
ENV UV_LINK_MODE=copy

# Install the project's dependencies using the lockfile and settings
RUN --mount=type=cache,target=/root/.cache/uv \
	--mount=type=bind,source=uv.lock,target=uv.lock \
	--mount=type=bind,source=pyproject.toml,target=pyproject.toml \
	uv sync --frozen --no-install-project --no-dev

COPY --chown=app:app . /app
RUN --mount=type=cache,target=/root/.cache/uv \
	uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 80

CMD ["uv", "run", "flask", "--app", "app", "run", "--host=0.0.0.0", "--port=80"]