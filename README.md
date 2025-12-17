# 🚗 AutoCare.ai - Predictive Maintenance System

**AutoCare.ai** is an intelligent vehicle fleet management platform developed by our engineering team. It leverages **Machine Learning** to predict component failures and visualizes diagnostics through an interactive **3D Holographic Dashboard**.

---

## 🏗️ Project Overview

Our team designed this solution to bridge the gap between raw telematics data and actionable maintenance insights.

### Core Architecture
*   **Backend (The Intelligence)**: We implemented a detailed Python/FastAPI server that simulates realistic vehicle sensor streams (Engine Temp, Oil Pressure, Vibration) and processes them using a Random Forest Classifier.
*   **Frontend (The Interface)**: A responsive React application featuring a real-time dashboard and a custom-built 3D engine visualizer.
*   **Customer Engagement**: Integrated **Voice AI** (Vapi.ai) to automate service coordination calls.

---

## 🛠️ Technology Stack

We utilized a modern full-stack approach:

*   **Frontend**: React, Vite, Tailwind CSS
*   **3D Visualization**: React Three Fiber (Procedural Geometry & Shaders)
*   **Backend API**: Python, FastAPI
*   **Machine Learning**: Scikit-learn (Random Forest)
*   **Voice Integration**: Vapi Web SDK

---

## 📱 Key Features

### 1. Real-Time Fleet Dashboard
Provides a consolidated view of all fleet vehicles. Our system automatically flags vehicles as **CRITICAL** (Red) based on anomaly scores from the backend.

### 2. 3D Diagnostic Console
We developed a sophisticated 3D visualization using standard web technologies.
*   **Interaction**: Technicians can rotate and inspect the vehicle model.
*   **Visual Alert**: The specific failing component (e.g., Cooling Pump) is highlighted with a pulsating neon glow to ensure immediate identification.

### 3. AI-Driven Diagnostics
The specific "Run AI Diagnostics" module triggers our ML model to calculate the Real-Time Risk Percentage (e.g., "98% Failure Probability"), enabling proactive repair scheduling.

### 4. Interactive Architecture Map
To demonstrate our data flow and system design, we created a dedicated visualization page accessible at `/wireframe`.

---

## 🚀 Installation & Setup

### Prerequisites
*   Python 3.8+
*   Node.js 16+

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Generate Synthetic Data & Train Model
python vechicle_data.py
python train_model.py

# Start the API Server
python main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## � Team & Configuration

This project was built to demonstrate the application of AI in Automotive Engineering.

**Note**: For the AI Voice features to function, valid API keys must be configured in the `.env` file:
```env
VITE_VAPI_PUBLIC_KEY=...
VITE_VAPI_ASSISTANT_ID=...
```
