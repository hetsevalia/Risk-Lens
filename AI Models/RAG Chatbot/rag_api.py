# rag_api.py
import os
import traceback
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from langchain_pinecone import PineconeVectorStore
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from prompt import prompt_template
from helper import download_hugging_face_embeddings
from flask_cors import CORS

# Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)
load_dotenv()

# Load API keys
os.environ["PINECONE_API_KEY"] = os.getenv("PINECONE_API_KEY")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Load embeddings
embeddings = download_hugging_face_embeddings()

# Pinecone index
INDEX_NAME = "mufg"  # change if needed
vectorstore = PineconeVectorStore.from_existing_index(
    index_name=INDEX_NAME,
    embedding=embeddings
)

# Chat model (Gemini)
chat_model = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# Retriever + Chain
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})
qa_chain = create_stuff_documents_chain(chat_model, prompt_template)
rag_chain = create_retrieval_chain(retriever, qa_chain)


def safe_extract_health_info(health_form, health_result):
    """Safely extract and interpret health risk information"""
    health_info = {
        "risk_level": "Unknown",
        "score": 0,
        "details": ["No health data available"]
    }
    
    try:
        if health_form and isinstance(health_form, dict):
            # Extract key health metrics with safe defaults
            age = health_form.get("age", 0)
            bmi = health_form.get("BMI", 0)
            sys_bp = health_form.get("sysBP", 0)
            dia_bp = health_form.get("diaBP", 0)
            is_smoker = health_form.get("currentSmoker", 0) == 1
            has_diabetes = health_form.get("diabetes", 0) == 1
            
            health_info["details"] = [
                f"Age: {age} years",
                f"BMI: {bmi}",
                f"Blood Pressure: {sys_bp}/{dia_bp}",
                f"Smoking: {'Yes' if is_smoker else 'No'}",
                f"Diabetes: {'Yes' if has_diabetes else 'No'}"
            ]
            
            # Calculate risk level based on results or simple heuristics
            if health_result and isinstance(health_result, dict):
                if "probability" in health_result:
                    cvd_risk = health_result["probability"]
                    health_info["score"] = round(100 * (1 - cvd_risk))
                    
                    if cvd_risk < 0.05:
                        health_info["risk_level"] = "Low Risk"
                    elif cvd_risk < 0.15:
                        health_info["risk_level"] = "Medium Risk"
                    else:
                        health_info["risk_level"] = "High Risk"
                else:
                    # Simple heuristic based on basic risk factors
                    risk_factors = sum([
                        1 if age > 50 else 0,
                        1 if bmi > 30 else 0,
                        1 if sys_bp > 140 else 0,
                        1 if is_smoker else 0,
                        1 if has_diabetes else 0
                    ])
                    
                    health_info["score"] = max(0, 100 - (risk_factors * 20))
                    
                    if risk_factors <= 1:
                        health_info["risk_level"] = "Low Risk"
                    elif risk_factors <= 3:
                        health_info["risk_level"] = "Medium Risk"
                    else:
                        health_info["risk_level"] = "High Risk"
            
    except Exception as e:
        print(f"Error extracting health info: {str(e)}")
    
    return health_info


def safe_extract_finance_info(finance_form, finance_result):
    """Safely extract and interpret financial risk information"""
    finance_info = {
        "risk_level": "Unknown",
        "score": 0,
        "details": ["No financial data available"]
    }
    
    try:
        if finance_form and isinstance(finance_form, dict):
            # Extract key financial metrics with safe defaults
            credit_score = finance_form.get("Credit_Score", 0)
            dti_ratio = finance_form.get("Debt_to_Income_Ratio", 0)
            income = finance_form.get("Income", 0)
            loan_amount = finance_form.get("Loan_Amount", 0)
            employment = finance_form.get("Employment_Status", "Unknown")
            payment_history = finance_form.get("Payment_History", "Unknown")
            previous_defaults = finance_form.get("Previous_Defaults", 0)
            
            finance_info["details"] = [
                f"Credit Score: {credit_score}",
                f"Debt-to-Income Ratio: {dti_ratio}%",
                f"Annual Income: ${income:,}",
                f"Loan Amount: ${loan_amount:,}",
                f"Employment: {employment}",
                f"Payment History: {payment_history}",
                f"Previous Defaults: {previous_defaults}"
            ]
            
            # Calculate financial risk score
            if finance_result and isinstance(finance_result, dict):
                if "FSI" in finance_result:
                    fsi = finance_result["FSI"]
                    finance_info["score"] = round(100 * (1 - fsi))
                elif "RiskRating" in finance_result:
                    rating = finance_result["RiskRating"]
                    if rating == "Low":
                        finance_info["score"] = 80
                    elif rating == "Medium":
                        finance_info["score"] = 50
                    else:
                        finance_info["score"] = 20
            else:
                # Simple heuristic based on available data
                risk_factors = 0
                if credit_score > 0:
                    if credit_score < 600:
                        risk_factors += 3
                    elif credit_score < 700:
                        risk_factors += 2
                    elif credit_score < 750:
                        risk_factors += 1
                
                if dti_ratio > 50:
                    risk_factors += 2
                elif dti_ratio > 36:
                    risk_factors += 1
                
                if previous_defaults > 0:
                    risk_factors += previous_defaults
                
                finance_info["score"] = max(0, 100 - (risk_factors * 15))
            
            # Determine risk level based on score
            if finance_info["score"] >= 80:
                finance_info["risk_level"] = "Low Risk"
            elif finance_info["score"] >= 50:
                finance_info["risk_level"] = "Medium Risk"
            else:
                finance_info["risk_level"] = "High Risk"
                
    except Exception as e:
        print(f"Error extracting finance info: {str(e)}")
    
    return finance_info


def safe_calculate_time_horizon(health_info, finance_info):
    """Safely calculate time horizon based on health and finance scores"""
    try:
        avg_score = (health_info["score"] + finance_info["score"]) / 2
        
        if avg_score >= 70:
            return {
                "risk_level": "Long-term safe zone",
                "score": round(avg_score),
                "details": ["Strong health and financial foundation for long-term planning"]
            }
        elif avg_score >= 40:
            return {
                "risk_level": "Moderate horizon",
                "score": round(avg_score),
                "details": ["Moderate planning horizon with some risk factors to address"]
            }
        else:
            return {
                "risk_level": "Short horizon",
                "score": round(avg_score),
                "details": ["High-risk profile requiring immediate attention and short-term planning"]
            }
    except Exception as e:
        print(f"Error calculating time horizon: {str(e)}")
        return {
            "risk_level": "Unknown",
            "score": 0,
            "details": ["Unable to calculate time horizon"]
        }


@app.route("/ask", methods=["POST"])
def ask():
    """Handle user questions with comprehensive error handling"""
    try:
        # Get and validate input data
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        user_input = data.get("input", "")
        if not user_input.strip():
            return jsonify({"error": "User input is required"}), 400
        
        # Extract form data with safe defaults
        finance_form = data.get("finance_form")
        health_form = data.get("health_form")
        finance_result = data.get("finance_result")
        health_result = data.get("health_result")
        
        print(f"Form data - Health: {health_form is not None}, Finance: {finance_form is not None}")
        print(f"Result data - Health: {health_result is not None}, Finance: {finance_result is not None}")
        
        # Process information safely
        health_info = safe_extract_health_info(health_form, health_result)
        finance_info = safe_extract_finance_info(finance_form, finance_result)
        time_horizon_info = safe_calculate_time_horizon(health_info, finance_info)
        
        print(f"Processed - Health: {health_info['risk_level']}, Finance: {finance_info['risk_level']}")
        
        # Build RAG input with safe string joining
        try:
            health_details_str = "; ".join(health_info.get("details", []))
            finance_details_str = "; ".join(finance_info.get("details", []))
            time_horizon_details_str = "; ".join(time_horizon_info.get("details", []))
        except Exception as e:
            print(f"Error joining details: {str(e)}")
            health_details_str = "Details unavailable"
            finance_details_str = "Details unavailable"
            time_horizon_details_str = "Details unavailable"
        
        # Prepare RAG input
        rag_input = {
            "input": user_input,
            "health_risk": str(health_info.get("risk_level", "Unknown")),
            "health_score": str(health_info.get("score", 0)),
            "health_details": health_details_str,
            "finance_risk": str(finance_info.get("risk_level", "Unknown")),
            "finance_score": str(finance_info.get("score", 0)),
            "finance_details": finance_details_str,
            "time_horizon_risk": str(time_horizon_info.get("risk_level", "Unknown")),
            "time_horizon_score": str(time_horizon_info.get("score", 0)),
            "time_horizon_details": time_horizon_details_str
        }
        
        print(f"RAG input prepared: {rag_input}")
        
        # Run RAG chain with error handling
        try:
            response = rag_chain.invoke(rag_input)
            answer = response.get("answer", "I apologize, but I couldn't generate a response.")
        except Exception as e:
            print(f"RAG chain error: {str(e)}")
            traceback.print_exc()
            answer = f"I apologize, but I'm having trouble processing your request right now. Please try rephrasing your question or try again later."
        
        return jsonify({
            "query": user_input,
            "answer": answer,
            "sources": [],  # Include sources if available in response
            "processed_data": {
                "health": health_info,
                "finance": finance_info,
                "time_horizon": time_horizon_info
            }
        })
        
    except Exception as e:
        print(f"Critical error in ask endpoint: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "error": "An internal server error occurred",
            "details": str(e),
            "query": data.get("input", "") if 'data' in locals() else ""
        }), 500


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    try:
        return jsonify({"status": "healthy", "message": "RAG API is running"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/test", methods=["POST"])
def test_endpoint():
    """Test endpoint to verify data structure"""
    try:
        data = request.get_json()
        return jsonify({
            "status": "success",
            "received_data": data,
            "data_keys": list(data.keys()) if data else [],
            "has_finance_form": "finance_form" in (data or {}),
            "has_health_form": "health_form" in (data or {}),
            "finance_form_keys": list(data.get("finance_form", {}).keys()) if data and data.get("finance_form") else [],
            "health_form_keys": list(data.get("health_form", {}).keys()) if data and data.get("health_form") else []
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)