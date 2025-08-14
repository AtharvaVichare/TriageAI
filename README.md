# TriageAI: AI-Powered Emergency Triage Assistant

![TriageAI Screenshot](https://github.com/AtharvaVichare/TriageAI/blob/main/Capture.PNG)


![TriageAI Screenshot](https://github.com/AtharvaVichare/TriageAI/blob/main/Capture1.PNG)


**TriageAI** is a full-stack, AI-powered decision support tool designed to assist medical professionals in rapidly and accurately assessing patient severity in emergency settings. The application leverages a deep learning model to predict the Emergency Severity Index (ESI) based on patient data, combined with a clinical safety net to ensure patient safety for critical conditions.

---

## Features

- **AI-Powered ESI Prediction**: Utilizes a TensorFlow/Keras neural network trained on over 500,000 patient records to predict ESI levels 1 through 5.
- **Clinical Safety Net**: Implements a hierarchical, rule-based override system to guarantee correct triage for absolute, life-threatening conditions like cardiac arrest and stroke.
- **Comprehensive Symptom Input**: Features a user-friendly form with a searchable, multi-select dropdown for over 300 clinically relevant symptoms.
- **Persistent Patient Queue**: All assessments are saved to a PostgreSQL database, providing a real-time, prioritized patient queue that is accessible to all users.
- **Full-Stack Architecture**: Built with a modern tech stack, featuring a React frontend and a FastAPI backend.

---

## Technology Stack

| Area       | Technology                                    |
| :--------- | :-------------------------------------------- |
| **Frontend** | React, TypeScript, Tailwind CSS, React Router |
| **Backend** | Python, FastAPI, TensorFlow/Keras, SQLAlchemy |
| **Database** | PostgreSQL                                    |

---

## Getting Started

This project is structured as a monorepo with two main folders: `backend` and `frontend`. You will need two separate terminals to run the application.

### Backend Setup

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```
2.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure the Database:**
    - Make sure you have PostgreSQL installed and running.
    - Create a new database named `triage_db`.
    - In `main.py`, update the `DATABASE_URL` with your PostgreSQL password.
5.  **Start the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Open a new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

---

## Future Work

This project serves as a robust foundation. Future enhancements could include:

- **Disposition Prediction**: Train a new model to predict patient disposition (Admit/Home/Transfer).
- **Resource Utilization Prediction**: Predict the likelihood of a patient requiring high-cost resources like an ICU bed or CT scan.
- **User Authentication**: Add a login system for different clinical users.
- **Real-time Dashboard**: Create an analytics dashboard to visualize triage statistics over time.
