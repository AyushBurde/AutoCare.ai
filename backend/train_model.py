import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle

def train():
    print("⏳ Loading Data and Training Model...")
    # 1. Load
    try:
        df = pd.read_csv('synthetic_telematics_data.csv')
    except FileNotFoundError:
        print(" Error: CSV not found. Run generate_data.py first!")
        return

    # 2. Feature Engineering (Moving Averages)
    df['temp_ma_3h'] = df.groupby('vehicle_id')['engine_temp_c'].transform(lambda x: x.rolling(window=3).mean())
    df['pressure_ma_3h'] = df.groupby('vehicle_id')['oil_pressure_psi'].transform(lambda x: x.rolling(window=3).mean())
    df['vib_ma_3h'] = df.groupby('vehicle_id')['vibration_hz'].transform(lambda x: x.rolling(window=3).mean())
    df = df.dropna() # Remove empty first rows

    # 3. Define X and y
    features = ['engine_temp_c', 'oil_pressure_psi', 'vibration_hz', 'rpm', 'temp_ma_3h', 'pressure_ma_3h', 'vib_ma_3h']
    X = df[features]
    y = df['failure_label']

    # 4. Train
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # 5. Evaluate
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"Model Accuracy: {acc*100:.2f}%")

    # 6. Save
    with open('failure_predictor.pkl', 'wb') as f:
        pickle.dump(model, f)
    print(" Success! Model saved as 'failure_predictor.pkl'")

if __name__ == "__main__":
    train()