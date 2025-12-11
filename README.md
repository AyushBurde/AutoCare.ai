# 🚗 Kritagya Automotive - Backend & Intelligence Layer

This repository contains the **Machine Learning Core** and **Backend API** for the Kritagya Predictive Maintenance System.

### ✅ What is completed?
1.  **Telematics Data Generator** (`generate_data.py`):
    * Creates a synthetic dataset of 10 vehicles.
    * Simulates "Cooling Pump Failure" patterns (Rising Temp + Dropping Pressure).
2.  **ML Model** (`train_model.py`):
    * Uses a **Random Forest Classifier** to detect failures.
    * Includes Feature Engineering (3-Hour Moving Averages) for stability.
    * Saves the trained "Brain" as `failure_predictor.pkl`.
3.  **Backend API** (`main.py`):
    * Built with **FastAPI**.
    * Exposes endpoints for the React Frontend to get real-time predictions.

---

### ⚙️ How to Setup (For Daksh)

1.  **Clone the Repo**
  

2.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Initialize the System** (Run these in order)
    ```bash
    python vehicle_data.py  # Generates the CSV
    python train_model.py    # Trains and saves the .pkl model
    ```

4.  **Start the Server**
    ```bash
    python main.py
    ```
    * Server will run at: `http://localhost:8000`
    * Test Interface: `http://localhost:8000/docs`

---

### 🔌 API Endpoints for Frontend

**1. Predict Failure Risk**
* **Endpoint:** `POST /predict`
* **Input (JSON):**
    ```json
    {
      "engine_temp_c": 105.5,
      "oil_pressure_psi": 25.0,
      "vibration_hz": 45.0,
      "rpm": 2200,
      "temp_ma_3h": 104.0,
      "pressure_ma_3h": 26.0,
      "vib_ma_3h": 44.0
    }
    ```
* **Response:** Returns `failure_risk_score` (0-100%) and `alert_level`.

**2. Manufacturing Insights**
* **Endpoint:** `GET /insights`
* **Response:** Returns RCA data and recommendations for the "Quality Loop" slide.

---

### 🚀 Next Steps (Frontend)
* Build the Dashboard using the data from `/predict`.
* Trigger a "Red Alert" UI when `alert_level` is "CRITICAL".
