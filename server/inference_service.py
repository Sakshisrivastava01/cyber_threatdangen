from typing import Dict

from hf_loader import HFLoader


class HuggingFaceInferenceService:
    def __init__(self):
        self.loader = HFLoader()

    def analyze_text(self, text: str) -> Dict[str, object]:
        if not text or not text.strip():
            return {
                "response": "No cybersecurity query provided.",
                "confidence": 0.0,
                "model": self.loader.model_name,
                "available": self.loader.available,
            }

        result = self.loader.generate(text)
        response_text = result.get("text") or "HuggingFace model unavailable. Please try again later."
        score = float(result.get("score", 0.0) or 0.0)

        if not result.get("available", False) or not response_text:
            return {
                "response": response_text,
                "confidence": 0.35,
                "model": self.loader.model_name,
                "available": False,
            }

        normalized_confidence = min(max(score, 0.15), 0.99) if score > 0 else 0.75
        return {
            "response": response_text,
            "confidence": round(normalized_confidence, 2),
            "model": self.loader.model_name,
            "available": True,
        }


hf_inference_service = HuggingFaceInferenceService()
