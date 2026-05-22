import time
from threading import Lock
from typing import Any, Dict, Optional


class CacheManager:
    def __init__(self):
        self.store: Dict[str, Dict[str, Any]] = {}
        self.lock = Lock()

    def get(self, key: str) -> Optional[Any]:
        with self.lock:
            entry = self.store.get(key)
            if not entry:
                return None
            if entry["expires_at"] and entry["expires_at"] < time.time():
                del self.store[key]
                return None
            return entry["value"]

    def set(self, key: str, value: Any, ttl: int = 60) -> None:
        with self.lock:
            self.store[key] = {
                "value": value,
                "expires_at": time.time() + ttl if ttl else None,
            }

    def clear(self) -> None:
        with self.lock:
            self.store.clear()


cache_manager = CacheManager()
