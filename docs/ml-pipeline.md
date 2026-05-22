# ML Pipeline

The DANGEN ML pipeline is engineered for threat scoring, anomaly detection, and predictive intelligence.

## Threat prediction flow

- Synthetic training data is generated in `server/ml_engine/threat_predictor.py`.
- Feature vectors include packet rate, failed logins, suspicious requests, traffic spike, unusual ports, and geo mismatch.
- A standard scaler normalizes features before prediction.
- The engine runs an ensemble of models:
  - Random Forest
  - Logistic Regression
  - Support Vector Machine
  - Naive Bayes
  - Decision Tree
- Ensemble scores are aggregated into a final threat probability and severity label.

## Anomaly detection

- `IsolationForest` is used to detect anomalous telemetry points.
- Batch anomaly analysis is exposed through `/api/ml/anomaly`.
- The model returns anomaly state, severity, and confidence for each record.

## Forecasting and cluster analysis

- The system simulates a tactical threat forecast curve for operational dashboards.
- K-Means clustering groups telemetry into strategic categories, such as reconnaissance, exploitation, and high-velocity attack phases.

## Production considerations

- `server/requirements.txt` includes core ML runtime packages.
- The modular predictor design allows replacement with real training datasets or cloud-hosted model endpoints.
- Future production work can add model persistence, retraining pipelines, and feature store integration.
