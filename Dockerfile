FROM python:3.12-slim

WORKDIR /app

# Install Node.js for frontend building if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY . .

EXPOSE 8000

ENV PORT=8000
CMD ["python3", "backend/server.py"]
