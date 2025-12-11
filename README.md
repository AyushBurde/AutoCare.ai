# 🚗 AutoCare.ai - Predictive Maintenance System

**AutoCare.ai** is an intelligent predictive maintenance platform for vehicle fleets. It combines Machine Learning (Random Forest) for failure prediction with a Modern React Dashboard and Voice AI (Vapi.ai) for proactive customer engagement.

---

## 🏗️ Project Architecture

The system consists of two main components:

1.  **Backend (Python/FastAPI)**:
    *   **ML Model**: Random Forest Classifier (`failure_predictor.pkl`) trained on synthetic telematics data.
    *   **API**: Exposes endpoints (`/predict`, `/insights`) for the frontend.
    *   **Data Generation**: Simulates realistic sensor data (Engine Temp, Oil Pressure, Vibration).

2.  **Frontend (React + Vite + Tailwind)**:
    *   **Fleet Dashboard**: Real-time monitoring of vehicle health (Green/Red status).
    *   **Vehicle Detail**: Interactive charts (Recharts) and AI Diagnostics.
    *   **Voice Agent**: Integrated **Vapi.ai** to call customers automatically when critical failures are predicted.
    *   **Manufacturing Insights**: Feedback loop for quality improvements.

---

## 🚀 Quick Start Guide

### Prerequisites
*   Python 3.8+
*   Node.js 16+

### 1. Backend Setup (The Brain)
Open a terminal in the `backend/` directory:

```bash
cd backend
pip install -r requirements.txt

# Initialize System (Generate Data & Train Model)
python vechicle_data.py
python train_model.py

# Start API Server
python main.py
```
*Server runs at: `http://localhost:8000`*

### 2. Frontend Setup (The Interface)
Open a **new** terminal in the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```
*Dashboard runs at: `http://localhost:5173`*

---

## 🔑 Configuration (Voice AI)

The frontend uses **Vapi.ai** for the "Call Owner" feature.
The API Keys are configured in `frontend/.env`:

```env
VITE_VAPI_PUBLIC_KEY=your_public_key
VITE_VAPI_ASSISTANT_ID=your_assistant_id
```

---

## 📱 Application Flow (Demo Script)

1.  **Fleet Overview**: Open the dashboard. Notice **MH-12-AB-1000** is CRITICAL (Red).
2.  **Drill Down**: Click on the red car to view details.
3.  **Run Diagnostics**: Click "Run AI Analysis". The ML model predicts **98% Risk** of Cooling Pump failure.
4.  **Take Action**: Click "Contact Customer (AI)". This triggers a voice call to the owner explaining the issue and booking an appointment.
5.  **Quality Loop**: Navigate to "Manufacturing Intelligence" to see how this data helps engineering (e.g., "Upgrade to Viton Seals").

---

## 🛠️ Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons, Vapi Web SDK
*   **Backend**: Python, FastAPI, Scikit-learn, Pandas, Uvicorn
