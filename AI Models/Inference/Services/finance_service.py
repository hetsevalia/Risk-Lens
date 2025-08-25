import joblib
import pandas as pd
import os

class FinanceService:
    def __init__(self):
        base_path = os.path.dirname(os.path.dirname(__file__)) 
        models_path = os.path.join(base_path, "Models")

        self.model = joblib.load(os.path.join(models_path, "finance_xgb_model.pkl"))
        self.label_encoders = joblib.load(os.path.join(models_path, "finance_label_encoders.pkl"))
        self.target_encoder = joblib.load(os.path.join(models_path, "finance_target_encoder.pkl"))

        self.cols = [
            "Age","Gender","Education Level","Marital Status","Income","Credit Score",
            "Loan Amount","Loan Purpose","Employment Status","Years at Current Job",
            "Payment History","Debt-to-Income Ratio","Assets Value","Number of Dependents"
            ,"Previous Defaults","Marital Status Change"
        ]

    def preprocess_input(self, input_dict):
        df = pd.DataFrame([input_dict], columns=self.cols)
        for col, le in self.label_encoders.items():
            if col in df:
                df[col] = le.transform(df[col].astype(str))
        return df

    def predict(self, input_dict):
        X_new = self.preprocess_input(input_dict)
        y_pred = self.model.predict(X_new)
        risk = self.target_encoder.inverse_transform(y_pred)
        return risk[0]
