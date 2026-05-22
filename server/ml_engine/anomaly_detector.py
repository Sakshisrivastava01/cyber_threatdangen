import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Dict, Any, Optional

from .model_registry import ModelRegistry


class AnomalyDetector:
    def __init__(self, model_name: str = "anomaly_detector"):
        self.model_name = model_name
        self.registry = ModelRegistry()
        self.model = self.registry.load_model(model_name)
        if self.model is None:
            self.model = self._build_fallback_model()

    def _build_fallback_model(self) -> IsolationForest:
        data = np.vstack([
            np.random.normal(loc=50, scale=15, size=(200, 6)),
            np.random.normal(loc=500, scale=150, size=(200, 6)),
        ]).astype(float)
        model = IsolationForest(contamination=0.2, random_state=42)
        model.fit(data)
        return model

    def predict(self, features: Dict[str, float]) -> Dict[str, Any]:
        vector = np.array([[
            features.get("packet_rate", 50.0),
            features.get("failed_logins", 1.0),
            features.get("suspicious_reqs", 2.0),
            features.get("traffic_spike", 0.05),
            features.get("unusual_ports", 0.5),
            features.get("geo_mismatch", 0.1),
        ]])

        score = float(self.model.decision_function(vector)[0])
        anomaly = int(self.model.predict(vector)[0] == -1)
        confidence = round(max(0.0, min(1.0, (score + 0.5))), 2)

        return {
            "is_anomaly": bool(anomaly),
            "anomaly_score": score,
            "confidence_score": confidence,
        }

    def score(self, features: Dict[str, float]) -> float:
        return self.predict(features)["confidence_score"]
