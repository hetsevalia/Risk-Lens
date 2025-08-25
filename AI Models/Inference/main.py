from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
# Import model services
from Services.finance_service import FinanceService
from Services.health_service import HealthService

# Initialize services
finance_service = FinanceService()
health_service = HealthService()

app = FastAPI(title="Multi-Model Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to specific domains instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas
class FinanceInput(BaseModel):
    Age: int
    Gender: str
    Education_Level: str
    Marital_Status: str
    Income: float
    Credit_Score: float
    Loan_Amount: float
    Loan_Purpose: str
    Employment_Status: str
    Years_at_Current_Job: int
    Payment_History: str
    Debt_to_Income_Ratio: float
    Assets_Value: float
    Number_of_Dependents: int
    Previous_Defaults: int
    Marital_Status_Change: int

class HealthRequest(BaseModel):
    male: int
    age: int
    education: int
    currentSmoker: int
    cigsPerDay: float
    BPMeds: int
    prevalentStroke: int
    prevalentHyp: int
    diabetes: int
    totChol: float
    sysBP: float
    diaBP: float
    BMI: float
    heartRate: float
    glucose: float
    
# Endpoints

@app.get("/")
def root():
    return {"message": "Welcome to the Risk Prediction API"}

@app.post("/finance/predict")
def finance_predict(input_data: FinanceInput):
    data_dict = {
        "Age": input_data.Age,
        "Gender": input_data.Gender,
        "Education Level": input_data.Education_Level,
        "Marital Status": input_data.Marital_Status,
        "Income": input_data.Income,
        "Credit Score": input_data.Credit_Score,
        "Loan Amount": input_data.Loan_Amount,
        "Loan Purpose": input_data.Loan_Purpose,
        "Employment Status": input_data.Employment_Status,
        "Years at Current Job": input_data.Years_at_Current_Job,
        "Payment History": input_data.Payment_History,
        "Debt-to-Income Ratio": input_data.Debt_to_Income_Ratio,
        "Assets Value": input_data.Assets_Value,
        "Number of Dependents": input_data.Number_of_Dependents,
        "Previous Defaults": input_data.Previous_Defaults,
        "Marital Status Change": input_data.Marital_Status_Change,
    }

    result = finance_service.predict(data_dict)
    return {"Risk Rating": result}

@app.post("/health/predict")
def health_endpoint(request: HealthRequest):
    result = health_service.predict(request.dict())
    return result

# Run API
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
