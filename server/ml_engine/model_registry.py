import json
import os
from pathlib import Path
from typing import Any, Dict, Optional

import joblib

MODEL_DIR = Path(__file__).resolve().parent.parent / "saved_models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
REGISTRY_PATH = MODEL_DIR / "registry.json"

DEFAULT_REGISTRY = {"models": {}}


class ModelRegistry:
    def __init__(self):
        self.registry_file = REGISTRY_PATH
        self.registry = self._load_registry()

    def _load_registry(self) -> Dict[str, Any]:
        if self.registry_file.exists():
            try:
                return json.loads(self.registry_file.read_text(encoding="utf-8"))
            except Exception:
                return DEFAULT_REGISTRY.copy()
        return DEFAULT_REGISTRY.copy()

    def _persist_registry(self) -> None:
        self.registry_file.write_text(json.dumps(self.registry, indent=2), encoding="utf-8")

    def save_model(self, name: str, model: Any, metadata: Optional[Dict[str, Any]] = None) -> None:
        path = MODEL_DIR / f"{name}.joblib"
        joblib.dump(model, path)
        self.registry["models"][name] = {
            "path": str(path.name),
            "version": metadata.get("version") if metadata else "1.0",
            "created_at": metadata.get("created_at") if metadata else "unknown",
            "description": metadata.get("description") if metadata else "",
        }
        self._persist_registry()

    def load_model(self, name: str) -> Optional[Any]:
        meta = self.registry["models"].get(name)
        if not meta:
            return None

        path = MODEL_DIR / meta["path"]
        if not path.exists():
            return None

        return joblib.load(path)

    def get_model_info(self, name: str) -> Dict[str, Any]:
        return self.registry["models"].get(name, {})

    def list_models(self) -> Dict[str, Any]:
        return self.registry["models"]
