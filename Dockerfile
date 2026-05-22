FROM python:3.12-slim

WORKDIR /app

COPY server/requirements.txt .
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY server/ .

EXPOSE 8000
CMD ["uvicorn", "dangen_gateway:app", "--host", "0.0.0.0", "--port", "8000"]