from pathlib import Path
from typing import Optional, Tuple

import pickle

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


MODEL_PATH = Path(__file__).resolve().parent / "ml" / "model.pkl"


def load_model():
    """
    Load the trained ML model from disk.
    This is executed once when the application starts.
    """
    with MODEL_PATH.open("rb") as model_file:
        return pickle.load(model_file)


model = load_model()


app = FastAPI(
    title="Feature Failure Predictor API",
    description="Predict the risk of software feature failure using a trained ML model.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    feature_name: Optional[str] = None
    lines_changed: int
    files_changed: int
    complexity_score: int
    developer_experience: int
    past_bug_count: int
    commit_frequency: int


class PredictionResponse(BaseModel):
    feature_name: str
    risk_score: float
    risk_level: str
    recommendation: str


def get_risk_level(probability: float) -> Tuple[str, str]:
    """
    Convert a failure probability into a risk level and recommendation.
    """
    if probability > 0.7:
        return "HIGH", "High risk detected. Manual code review required."
    if probability > 0.4:
        return (
            "MEDIUM",
            "Moderate risk detected. Additional testing and peer review recommended.",
        )
    return "LOW", "Low risk detected. Standard review process is sufficient."


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest) -> PredictionResponse:
    """
    Predict the risk of feature failure for the provided change metrics.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Prediction model is not available.")

    # Construct input DataFrame with the exact feature names used during training.
    input_df = pd.DataFrame(
        [
            [
                request.lines_changed,
                request.files_changed,
                request.complexity_score,
                request.developer_experience,
                request.past_bug_count,
                request.commit_frequency,
            ]
        ],
        columns=[
            "lines_changed",
            "files_changed",
            "complexity_score",
            "developer_experience",
            "past_bug_count",
            "commit_frequency",
        ],
    )

    try:
        proba = model.predict_proba(input_df)
    except Exception as exc:  # pragma: no cover - defensive fallback
        raise HTTPException(
            status_code=500,
            detail="Error while generating prediction from the model.",
        ) from exc

    # Extract probability for the failure class (class label 1 when available).
    if hasattr(model, "classes_") and 1 in getattr(model, "classes_", []):
        classes = np.array(model.classes_)
        failure_index = int(np.where(classes == 1)[0][0])
        failure_prob = float(proba[0][failure_index])
    else:
        # Fallback: assume binary classification and that the positive class is at index 1.
        failure_prob = float(proba[0][1] if proba.shape[1] > 1 else proba[0][0])

    # Clamp to valid probability range.
    failure_prob = max(0.0, min(1.0, failure_prob))

    risk_score = round(failure_prob * 100, 1)
    risk_level, recommendation = get_risk_level(failure_prob)

    feature_name = request.feature_name or "Unnamed feature"

    return PredictionResponse(
        feature_name=feature_name,
        risk_score=risk_score,
        risk_level=risk_level,
        recommendation=recommendation,
    )


@app.get("/health")
def health_check() -> dict:
    """
    Simple health check endpoint.
    """
    return {"status": "ok"}


if __name__ == "__main__":
    # To run the development server, execute:
    # uvicorn main:app --reload
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

