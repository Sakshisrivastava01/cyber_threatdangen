import logging
from typing import Any, Dict, Optional

MODEL_NAME = "google/flan-t5-base"


class HFLoader:
    def __init__(self):
        self.pipeline = None
        self.model_name = MODEL_NAME
        self.available = False
        self._load_error: Optional[Exception] = None

    def _load_transformers(self):
        try:
            from transformers import pipeline
            return pipeline
        except Exception as exc:
            logging.warning("HuggingFace transformers not available: %s", exc)
            self._load_error = exc
            return None

    def load(self) -> None:
        if self.pipeline is not None:
            return

        pipeline_builder = self._load_transformers()
        if pipeline_builder is None:
            self.available = False
            return

        try:
            self.pipeline = pipeline_builder(
                "text2text-generation",
                model=self.model_name,
                tokenizer=self.model_name,
                max_new_tokens=180,
                do_sample=False,
                return_full_text=False,
            )
            self.available = True
        except Exception as exc:
            logging.warning("Failed to load HuggingFace model %s: %s", self.model_name, exc)
            self.pipeline = None
            self.available = False
            self._load_error = exc

    def generate(self, prompt: str) -> Dict[str, Any]:
        if not prompt:
            return {
                "text": "",
                "score": 0.0,
                "model": self.model_name,
                "available": self.available,
                "error": "Empty prompt provided.",
            }

        if self.pipeline is None:
            self.load()

        if not self.available or self.pipeline is None:
            return {
                "text": "",
                "score": 0.0,
                "model": self.model_name,
                "available": False,
                "error": str(self._load_error) if self._load_error else "Model unavailable.",
            }

        try:
            results = self.pipeline(prompt)
            if isinstance(results, list) and results:
                first = results[0]
                text = first.get("generated_text") or first.get("text") or ""
                score = float(first.get("score", 0.0) or 0.0)
                return {
                    "text": text.strip(),
                    "score": score,
                    "model": self.model_name,
                    "available": True,
                }

            return {
                "text": "",
                "score": 0.0,
                "model": self.model_name,
                "available": True,
                "error": "No output from inference pipeline.",
            }
        except Exception as exc:
            logging.warning("HuggingFace inference failed: %s", exc)
            return {
                "text": "",
                "score": 0.0,
                "model": self.model_name,
                "available": False,
                "error": str(exc),
            }
