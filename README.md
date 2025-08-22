
# RiskLens AI  
AI-powered Risk Assessment & Insights Platform  

RiskLens AI is an end-to-end AI project that predicts **Health Risk** and **Financial Risk**, provides detailed analysis dashboards, and integrates a **custom RAG-powered chatbot** to answer user queries.  

It combines **Machine Learning models (XGBoost, Random Forest, SMOTE, Scalers, Label Encoders)** with **LLMs (LangChain, Google Gemini, HuggingFace)** and **vector databases (Pinecone)** for intelligent insights.  

---

## Features  
- Financial Risk Prediction using XGBoost  
- Health Risk Prediction using Random Forest  
- Custom RAG Chatbot powered by LangChain, Pinecone & Google Gemini  
- Interactive Analysis Dashboard for individual risk insights  
- Dual API System:  
  - `main.py` → FastAPI for risk prediction  
  - `rag_api.py` → Flask API for RAG chatbot  
- Data Preprocessing: Label Encoding, Target Encoding, Standard Scaler, SMOTE  
- Model Serving with `.pkl` files for reproducibility  
- Modular Architecture with separate `AI Models`, `AI Training`, and `RAG Chatbot`  

---

## Project Structure  

```
RiskLens-AI/
│── AI Models/
│   ├── Inference/
│   │   ├── Models/
│   │   │   ├── finance_xgb_model.pkl
│   │   │   ├── finance_label_encoders.pkl
│   │   │   ├── finance_target_encoder.pkl
│   │   │   ├── health_random_forest_model.pkl
│   │   │   ├── health_scaler.pkl
│   │   ├── main.py        # FastAPI backend for predictions
│   │   ├── Services/
│
│── RAG Chatbot/
│   ├── rag_api.py         # Flask API for chatbot
│   ├── helper.py
│   ├── prompt.py
│
│── AI Training/
│   ├── Code/
│   │   ├── finance.ipynb
│   │   ├── health ensemble-learning-stacking-algorithm.ipynb
│   ├── Data/
│   │   ├── financial_risk_assessment.csv
│   │   ├── framingham.csv
│
│── app/                   # Frontend (Next.js/React + TypeScript APIs)
│
│── README.md
│── requirements.txt
```

---

## Installation  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/RiskLens-AI.git
cd RiskLens-AI
```

### 2. Install Node.js Dependencies  
```bash
npm install
```

### 3. Install Python Dependencies  
```bash
pip install -r requirements.txt
```

**requirements.txt** should include:  
```
pandas
numpy
scikit-learn
matplotlib
xgboost
flask
uvicorn
fastapi
langchain
pinecone-client
google-generativeai
huggingface_hub
imbalanced-learn   # for SMOTE
python-dotenv
```

### 4. Setup Environment Variables  
Create a `.env` file in `RAG Chatbot/` with your API keys:  
```
PINECONE_API_KEY=your_pinecone_key
GOOGLE_API_KEY=your_google_gemini_key
HUGGINGFACE_API_KEY=your_huggingface_key
```

---

## Running the Project  

### Step 1: Start FastAPI (Risk Prediction API)  
```bash
cd AI Models/Inference
uvicorn main:app --reload
```
This serves endpoints for financial & health risk predictions.  

### Step 2: Start Flask (RAG Chatbot API)  
```bash
cd RAG Chatbot
python rag_api.py
```
This serves the chatbot for follow-up Q&A.  

### Step 3: Start Frontend  
```bash
npm run dev
```
Now open: **http://localhost:3000**  

---

## API Endpoints  

### Risk Prediction API (FastAPI - `main.py`)  
- `POST /predict/financial` → Predicts financial risk  
- `POST /predict/health` → Predicts health risk  

### RAG Chatbot API (Flask - `rag_api.py`)  
- `POST /chat` → Ask questions about individual risk profiles  

---

## Demo Video  
[Watch the Project Demo](https://drive.google.com/file/d/1p0A7pdrKZ7L1nns3E1NH1e2XJ270Efai/view?usp=sharing)  

---

## Future Improvements  
- Expand datasets for broader risk domains  
- Add Explainable AI (XAI) for model predictions  
- Deploy on Docker + Kubernetes for scalability  
- Integrate with hospital/finance systems  

---

## License  
[hetsevalia/Risk-Lens](https://github.com/hetsevalia/Risk-Lens) is licensed under the **Apache License 2.0**.  

---

## Note  
This project is **not currently deployed** due to cost-cutting measures.  
It will be deployed before the **final presentation**.  

  




