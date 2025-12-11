from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
import uvicorn
import random

# 1. Initialize API
app = FastAPI(title="Kritagya Backend API")

# 2. Enable CORS (Allows Daksh's React App to talk to this)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load Model
try:
    with open('failure_predictor.pkl', 'rb') as f:
        model = pickle.load(f)
    print("✅ API Startup: Model loaded successfully.")
except FileNotFoundError:
    print("⚠️ Warning: Model file not found. Predictions will fail.")
    model = None

# 4. Define Data Structure
class TelematicsInput(BaseModel):
    engine_temp_c: float
    oil_pressure_psi: float
    vibration_hz: float
    rpm: int
    temp_ma_3h: float
    pressure_ma_3h: float
    vib_ma_3h: float

# --- ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "Online", "message": "Kritagya API is running on Localhost"}

@app.post("/predict")
def predict_failure(data: TelematicsInput):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded. Run train_model.py first.")
    
    # Convert input to DataFrame
    input_df = pd.DataFrame([data.dict()])
    
    # Predict
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]
    
    return {
        "failure_risk_score": round(probability * 100, 2),
        "is_failure_predicted": bool(prediction),
        "alert_level": "CRITICAL" if probability > 0.8 else "NORMAL"
    }

@app.get("/insights")
def get_insights():
    # Simulated Logic for Task A4
    return {
        "critical_component": "Cooling Pump",
        "total_failures_detected": 147,
        "pattern_detected": "High failure rate in Mumbai (Hot Zone) after 45000 km.",
        "recommendation": "Upgrade pump seal material to Viton (High-Temp Resistant)."
    }

# Run Server (Standard Python way)
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)