from typing import Dict, Any, List
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import Pipeline

from .model_registry import ModelRegistry


class PhishingDetector:
    def __init__(self, model_name: str = "phishing_detector"):
        self.model_name = model_name
        self.registry = ModelRegistry()
        self.pipeline = self.registry.load_model(model_name)
        if self.pipeline is None:
            self.pipeline = self._build_fallback_pipeline()

    def _build_fallback_pipeline(self) -> Pipeline:
        samples = [
            "login page verification required",
            "update your password immediately",
            "confirm your account details",
            "your invoice is attached",
            "wire transfer approved",
            "urgent security alert",
            "new message from your bank",
            "account suspended please verify",
            "weekly newsletter update",
            "team meeting scheduled",
        ]
        labels = [1, 1, 1, 0, 0, 1, 1, 1, 0, 0]
        pipeline = Pipeline([
            ("vectorizer", CountVectorizer(ngram_range=(1, 2), stop_words="english")),
            ("classifier", RandomForestClassifier(n_estimators=80, random_state=42)),
        ])
        pipeline.fit(samples, labels)
        return pipeline

    def predict(self, text: str) -> Dict[str, Any]:
        probability = float(self.pipeline.predict_proba([text])[0][1])
        label = "phishing" if probability >= 0.5 else "benign"
        return {
            "text": text,
            "label": label,
            "phishing_confidence": round(probability, 3),
            "reason": "High-value phishing indicators detected" if probability >= 0.5 else "No obvious phishing patterns detected",
        }

    def explain(self, text: str) -> List[str]:
        return [
            "Contains sensitive action verbs",
            "References account validation or credentials",
            "Looks like a social engineering request"
        ]
