import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_data():
    print("⏳ Generating Synthetic Data...")
    data = []
    NUM_VEHICLES = 10
    DAYS = 30
    START_DATE = datetime.now() - timedelta(days=DAYS)
    
    vehicle_ids = [f"MH-12-AB-{1000 + i}" for i in range(NUM_VEHICLES)]
    demo_vehicle_id = vehicle_ids[0] # The one that fails
    
    for v_id in vehicle_ids:
        is_failing = (v_id == demo_vehicle_id) or (random.random() < 0.2)
        base_temp = 85.0
        base_pressure = 40.0
        base_vibration = 15.0
        
        current_time = START_DATE
        for day in range(DAYS):
            for hour in range(24):
                timestamp = current_time + timedelta(days=day, hours=hour)
                
                # Add Noise
                current_temp = base_temp + np.random.normal(0, 1.5)
                current_pressure = base_pressure + np.random.normal(0, 1.0)
                current_vibration = base_vibration + np.random.normal(0, 2.0)
                rpm = int(np.random.normal(2500, 500))
                
                # Failure Logic (Last 10 days)
                if is_failing and day >= (DAYS - 10):
                    severity = ((day - (DAYS - 10)) * 24 + hour) / (10 * 24)
                    current_temp += (15.0 * severity) 
                    current_pressure -= (10.0 * severity)
                    current_vibration += (10.0 * severity)
                
                is_anomaly = 1 if (is_failing and day >= (DAYS - 10)) else 0
                
                data.append({
                    "vehicle_id": v_id,
                    "timestamp": timestamp,
                    "engine_temp_c": round(current_temp, 2),
                    "oil_pressure_psi": round(current_pressure, 2),
                    "vibration_hz": round(current_vibration, 2),
                    "rpm": rpm,
                    "failure_label": is_anomaly
                })
    
    df = pd.DataFrame(data)
    df.to_csv("synthetic_telematics_data.csv", index=False)
    print(f"✅ Success! Generated {len(df)} rows in 'synthetic_telematics_data.csv'")

if __name__ == "__main__":
    generate_data()