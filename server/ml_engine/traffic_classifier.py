from typing import Dict, Any
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from .model_registry import ModelRegistry


class TrafficClassifier:
    def __init__(self, model_name: str = "traffic_classifier"):
        self.model_name = model_name
        self.registry = ModelRegistry()
        self.pipeline = self.registry.load_model(model_name)
        if self.pipeline is None:
            self.pipeline = self._build_fallback_pipeline()

    def _build_fallback_pipeline(self) -> Pipeline:
        features = [
            [20, 0.1, 0.2, 0, 0.1, 0.05],
            [500, 12, 10, 0.6, 5, 0.7],
            [120, 1, 0.4, 0.05, 0.2, 0.12],
            [800, 30, 20, 0.9, 12, 0.8],
            [40, 0.3, 0.5, 0.1, 0.3, 0.2],
        ]
        labels = [0, 1, 0, 1, 0]
        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", RandomForestClassifier(n_estimators=80, random_state=42)),
        ])
        pipeline.fit(features, labels)
        return pipeline

    def classify(self, features: Dict[str, float]) -> Dict[str, Any]:
        vector = [[
            features.get("packet_rate", 50.0),
            features.get("failed_logins", 1.0),
            features.get("suspicious_reqs", 2.0),
            features.get("traffic_spike", 0.05),
            features.get("unusual_ports", 0.5),
            features.get("geo_mismatch", 0.1),
        ]]
        probability = float(self.pipeline.predict_proba(vector)[0][1])
        label = "malicious_traffic" if probability >= 0.5 else "benign_traffic"
        return {
            "label": label,
            "confidence": round(probability, 3),
            "traffic_type": label,
        }
