import datetime
from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from .model_registry import ModelRegistry


class TrainingPipeline:
    def __init__(self):
        self.registry = ModelRegistry()

    def _build_numeric_samples(self) -> Dict[str, Any]:
        features = np.vstack([
            np.random.normal(50, 15, (200, 6)),
            np.random.normal(500, 150, (200, 6)),
        ]).astype(float)
        labels = [0] * 200 + [1] * 200
        return {"X": features, "y": labels}

    def _build_text_samples(self) -> Dict[str, Any]:
        samples = [
            "confirm account details immediately",
            "your payment was processed",
            "click here to verify your credentials",
            "monthly performance report attached",
            "security alert for your login",
            "invoice overdue please pay",
            "team event scheduled",
            "reset your password now",
            "project kickoff tomorrow",
            "network operations status update",
        ]
        labels = [1, 0, 1, 0, 1, 1, 0, 1, 0, 0]
        return {"samples": samples, "labels": labels}

    def train_traffic_classifier(self) -> None:
        data = self._build_numeric_samples()
        model = Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", RandomForestClassifier(n_estimators=100, random_state=42)),
        ])
        model.fit(data["X"], data["y"])
        self.registry.save_model(
            "traffic_classifier",
            model,
            metadata={
                "version": "1.0",
                "created_at": datetime.datetime.utcnow().isoformat(),
                "description": "Baseline traffic classification model",
            },
        )

    def train_malware_classifier(self) -> None:
        features = [[0, 0, 0, 0, 0], [1, 1, 1, 0, 0], [0, 1, 1, 1, 0], [1, 0, 0, 1, 1]]
        labels = [0, 1, 1, 1]
        model = Pipeline([
            ("scaler", StandardScaler()),
            ("classifier", RandomForestClassifier(n_estimators=80, random_state=42)),
        ])
        model.fit(features, labels)
        self.registry.save_model(
            "malware_classifier",
            model,
            metadata={
                "version": "1.0",
                "created_at": datetime.datetime.utcnow().isoformat(),
                "description": "Baseline malware classification model",
            },
        )

    def train_phishing_detector(self) -> None:
        data = self._build_text_samples()
        model = Pipeline([
            ("vectorizer", CountVectorizer(ngram_range=(1, 2), stop_words="english")),
            ("classifier", RandomForestClassifier(n_estimators=80, random_state=42)),
        ])
        model.fit(data["samples"], data["labels"])
        self.registry.save_model(
            "phishing_detector",
            model,
            metadata={
                "version": "1.0",
                "created_at": datetime.datetime.utcnow().isoformat(),
                "description": "Baseline phishing detection pipeline",
            },
        )

    def train_anomaly_detector(self) -> None:
        data = self._build_numeric_samples()["X"]
        model = IsolationForest(contamination=0.2, random_state=42)
        model.fit(data)
        self.registry.save_model(
            "anomaly_detector",
            model,
            metadata={
                "version": "1.0",
                "created_at": datetime.datetime.utcnow().isoformat(),
                "description": "Isolation Forest anomaly detector for telemetry features",
            },
        )

    def train_all(self) -> None:
        self.train_traffic_classifier()
        self.train_malware_classifier()
        self.train_phishing_detector()
        self.train_anomaly_detector()
