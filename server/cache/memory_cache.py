"""
DANGEN In-Memory Cache Manager
Maintains circular buffers of recent threat telemetry and analytics snapshots.
"""
from typing import List, Dict, Any

class MemoryCache:
    def __init__(self, max_size: int = 100):
        self.max_size = max_size
        self._buffer: List[Dict[str, Any]] = []

    def add(self, item: Dict[str, Any]):
        self._buffer.append(item)
        if len(self._buffer) > self.max_size:
            self._buffer.pop(0)

    def get_all(self) -> List[Dict[str, Any]]:
        return list(self._buffer)

    def clear(self):
        self._buffer.clear()

threat_cache = MemoryCache()
