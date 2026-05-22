import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from typing import Dict, Optional


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 40, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.access_log: Dict[str, Dict[str, Optional[float]]] = {}

    async def dispatch(self, request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        data = self.access_log.get(client_ip, {"count": 0, "window_start": now})

        if now - data["window_start"] > self.window_seconds:
            data = {"count": 0, "window_start": now}

        data["count"] += 1
        self.access_log[client_ip] = data

        if data["count"] > self.max_requests:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "rate_limit_exceeded",
                    "detail": f"Rate limit exceeded: {self.max_requests} requests per {self.window_seconds} seconds.",
                },
            )

        response = await call_next(request)
        return response
