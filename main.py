import pandas as pd
import numpy as np
import pickle
import tensorflow as tf
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import json
from sqlalchemy import create_engine, Column, Integer, String, JSON, TIMESTAMP
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func
import os

# --- 1. DATABASE SETUP ---
DATABASE_URL = os.environ.get('DATABASE_URL', "postgresql://postgres:blackiebrownie3@localhost:5432/triage_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    symptoms = Column(JSON)
    predicted_esi = Column(Integer, nullable=False)
    assessment_time = Column(TIMESTAMP(timezone=True), server_default=func.now())
Base.metadata.create_all(bind=engine)

# --- 2. FASTAPI APP SETUP ---
app = FastAPI(title="Triage Assistant AI API", version="1.0")
origins = ["http://localhost:3000"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

try:
    model = tf.keras.models.load_model('final_triage_assistant_model.keras')
    with open('final_triage_preprocessor.pkl', 'rb') as f:
        preprocessor = pickle.load(f)
    with open('features.json', 'r') as f:
        selected_features = json.load(f)
    print("Model, preprocessor, and feature list loaded successfully.")
except Exception as e:
    print(f"Error loading files: {e}")
    model, preprocessor, selected_features = None, None, []

# --- 3. SYMPTOM SEVERITY MAP ---
SYMPTOM_SEVERITY_MAP = {
    'cardiaarrst': 1, 'cc_unresponsive': 1, 'shock': 1, 'acutemi': 2, 'acutecvd': 2,
    'respdistres': 2, 'septicemia': 2, 'syncope': 2, 'burns': 2, 'intracrninj': 2,
    'gihemorrhag': 2, 'coaghemrdx': 2, 'aneurysm': 2, 'chestpain': 3, 'abdomnlpain': 3,
    'pneumonia': 3, 'dysrhythmia': 3, 'chfnonhp': 3
}

# --- 4. PREDICTION ENDPOINT ---
@app.post("/predict")
def predict_esi(patient_data: dict):
    if not all([model, preprocessor, selected_features]):
        return {"error": "Model or preprocessor not loaded."}
    db = SessionLocal()
    try:
        print(f"--- Raw data received: --- \n{patient_data}")
        max_severity = 5
        triggered_symptom = None
        for symptom, severity in SYMPTOM_SEVERITY_MAP.items():
            if patient_data.get(symptom) == 1 and severity < max_severity:
                max_severity = severity
                triggered_symptom = symptom
        
        if max_severity <= 3:
            print(f"Expert rule triggered for '{triggered_symptom}': Returning ESI Level {max_severity}")
            predicted_class = max_severity
        else:
            print("No high-risk expert rules triggered. Proceeding with AI model.")
            input_df = pd.DataFrame([patient_data])
            for col in selected_features:
                if col not in input_df.columns:
                    input_df[col] = np.nan
            input_df = input_df[selected_features]
            processed_input = preprocessor.transform(input_df)
            prediction_proba = model.predict(processed_input)
            predicted_class = np.argmax(prediction_proba, axis=1)[0] + 1
            print(f"AI Model Prediction: ESI Level {predicted_class}")

        symptoms_to_save = {k: v for k, v in patient_data.items() if k in selected_features and v == 1 and k not in ['age', 'gender', 'patientId']}
        new_assessment = Assessment(
            patient_id=patient_data.get('patientId', 'Unknown'),
            age=patient_data.get('age'),
            gender=patient_data.get('gender'),
            symptoms=symptoms_to_save,
            predicted_esi=int(predicted_class)
        )
        db.add(new_assessment)
        db.commit()
        db.refresh(new_assessment)
        print(f"Successfully saved assessment ID {new_assessment.id} to the database.")
        return {"predicted_esi": int(predicted_class)}
    except Exception as e:
        db.rollback()
        print(f"An error occurred: {str(e)}")
        return {"error": f"An error occurred during prediction: {str(e)}"}
    finally:
        db.close()

@app.get("/")
def read_root(): return {"message": "Welcome to the Triage Assistant AI API"}
if __name__ == "__main__": uvicorn.run(app, host="127.0.0.1", port=8000)
# Add this new endpoint to your main.py file, for example, after the /predict endpoint

# Add this endpoint to main.py

@app.get("/queue")
def get_patient_queue():
    db = SessionLocal()
    try:
        # Query for the 50 most recent assessments, prioritized by severity
        patient_queue = db.query(Assessment).order_by(Assessment.predicted_esi.asc(), Assessment.assessment_time.desc()).limit(50).all()
        return patient_queue
    finally:
        db.close()