## Feature Failure Predictor

Predict the risk of software feature failure using a trained ML model, exposed via a FastAPI backend and a React (Vite) frontend.

---

### Tech stack

- **ML / Data**: Python, pandas, scikit-learn, RandomForest
- **Backend**: FastAPI, Uvicorn
- **Frontend**: React 18, Vite, TypeScript

---

### Project structure (key parts)

- `ml/`
  - `data.csv` – training data
  - `train_model.py` – trains the classifier and saves `model.pkl`
  - `model.pkl` – trained model used by the API
- `main.py` – FastAPI app exposing the `/predict` endpoint
- `frontend/` – React + Vite SPA
  - `src/components/FeatureFailurePredictor.tsx` – main UI
- `manual_prediction_test.py` – optional script to compare API output vs raw model
- `requirements.txt` – Python dependencies

---

### 1. Python environment setup

1. Create/activate a virtual environment (recommended):

   ```bash
   cd d:\Predictive-Software-Failure-Analysis
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

---

### 2. Train (or retrain) the ML model

The backend expects a trained model at `ml/model.pkl`. If this file is missing or you want to retrain:

```bash
cd ml
python train_model.py
```

This will:

- Load `data.csv`
- Train a `RandomForestClassifier`
- Save the trained model to `ml/model.pkl`

> You only need to rerun this when changing data or model logic.

---

### 3. Run the FastAPI backend

From the project root:

```bash
cd d:\Predictive-Software-Failure-Analysis
uvicorn main:app --reload
```

- API base URL: `http://localhost:8000`
- Swagger / interactive docs: `http://localhost:8000/docs`
- Health check: `GET http://localhost:8000/health`

#### `/predict` endpoint

- **Method**: `POST /predict`
- **Request body (JSON)**:

  ```json
  {
    "feature_name": "Payment Validation",
    "lines_changed": 120,
    "files_changed": 4,
    "complexity_score": 15,
    "developer_experience": 2,
    "past_bug_count": 3,
    "commit_frequency": 8
  }
  ```

- **Response (JSON)**:

  ```json
  {
    "feature_name": "Payment Validation",
    "risk_score": 73.4,
    "risk_level": "HIGH",
    "recommendation": "Manual code review required"
  }
  ```

`risk_score` is the model's predicted failure probability for class 1, multiplied by 100. Risk levels:

- `> 70%` → `HIGH`
- `> 40%` → `MEDIUM`
- `<= 40%` → `LOW`

---

### 4. Run the React frontend

> Node.js 18+ and npm are recommended.

1. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the URL printed in the terminal (typically `http://localhost:5173`).

4. Make sure the FastAPI backend is running at `http://localhost:8000` (the frontend is configured to call this URL).

The UI shows:

- Left card: form with feature name and change metrics
- Right card: prediction results (risk score, level, recommendation, and a high‑risk banner)

---

### 5. Manually verify API vs model (optional)

To confirm the API is returning the same values as the underlying model:

1. Ensure the backend is running (`uvicorn main:app --reload`).
2. From the project root, run:

   ```bash
   python manual_prediction_test.py
   ```

This script:

- Loads `ml/model.pkl` and computes a prediction directly in Python.
- Calls `POST http://localhost:8000/predict` with the same payload.
- Prints both risk scores and the difference, indicating whether they match within a small tolerance.

You can edit the `example_payload` inside `manual_prediction_test.py` to test other scenarios. The file is safe to delete once you no longer need it.

---

### 6. Common issues / troubleshooting

- **Server fails to start with model error**  
  Ensure `ml/model.pkl` exists by running:

  ```bash
  cd ml
  python train_model.py
  ```

- **Frontend shows "Prediction model is not available."**  
  This happens if the backend cannot load the model or is not running. Check:
  - `uvicorn main:app --reload` is running without errors.
  - `ml/model.pkl` exists.

- **CORS or network errors from frontend**  
  - Backend must be reachable at `http://localhost:8000`.
  - CORS is configured to allow all origins in `main.py`, so you normally should not need extra changes.

---

### 7. Summary for teammates

1. `pip install -r requirements.txt`
2. `cd ml && python train_model.py`
3. From project root: `uvicorn main:app --reload`
4. `cd frontend && npm install && npm run dev`
5. Visit the frontend URL and start predicting feature failure risk.

