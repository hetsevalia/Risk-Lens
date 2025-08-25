import joblib
import pandas as pd
import os

class HealthService:
    def __init__(self):
        base_path = os.path.dirname(os.path.dirname(__file__))  # D:\MUFG\Inference
        models_path = os.path.join(base_path, "Models")

        # Load saved model + scaler
        self.model = joblib.load(os.path.join(models_path, "health_random_forest_model.pkl"))
        self.scaler = joblib.load(os.path.join(models_path, "health_scaler.pkl"))

        # Keep feature order same as training
        self.cols = [
            "male", "age", "education", "cigsPerDay",
            "prevalentStroke", "prevalentHyp",
            "sysBP", "diaBP", "BMI", "heartRate", "glucose"
        ]

    def preprocess_input(self, input_dict):
        """Convert input dict to DataFrame and scale features"""
        df = pd.DataFrame([input_dict], columns=self.cols)
        X_scaled = self.scaler.transform(df)
        return X_scaled

    def predict(self, input_dict):
        """Run prediction with probability"""
        X_new = self.preprocess_input(input_dict)
        y_pred = self.model.predict(X_new)
        y_prob = self.model.predict_proba(X_new)[:, 1]

        return {
            "TenYearCHD": int(y_pred[0]),
            "probability": float(y_prob[0])
        }
