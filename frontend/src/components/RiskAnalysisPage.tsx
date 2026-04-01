import React from "react";
import type { Prediction } from "../App";

type RiskAnalysisPageProps = {
  latestPrediction: Prediction | null;
};

const factorLabel = (label: string, value: string, emphasis: "low" | "med" | "high") => {
  const baseClass = "risk-factor-bar";
  const emphasisClass =
    emphasis === "high"
      ? "risk-factor-bar-high"
      : emphasis === "med"
      ? "risk-factor-bar-medium"
      : "risk-factor-bar-low";

  return (
    <div className="risk-factor">
      <div className="risk-factor-header">
        <span className="risk-factor-name">{label}</span>
        <span className="risk-factor-value">{value}</span>
      </div>
      <div className={`${baseClass} ${emphasisClass}`} />
    </div>
  );
};

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({
  latestPrediction,
}) => {
  if (!latestPrediction) {
    return (
      <div className="page-root">
        <main className="layout">
          <section className="card card-form">
            <header className="card-header">
              <h1 className="title">Risk Analysis</h1>
              <p className="subtitle">
                Understand the drivers behind the latest prediction.
              </p>
            </header>
            <p className="placeholder-text">
              No prediction available. Please run a prediction first.
            </p>
          </section>
        </main>
      </div>
    );
  }

  const { feature_name, risk_score, risk_level, recommendation } =
    latestPrediction;

  return (
    <div className="page-root">
      <main className="layout">
        <section className="card card-form">
          <header className="card-header">
            <h1 className="title">Risk Analysis</h1>
            <p className="subtitle">
              Breakdown of the most recent prediction for{" "}
              <strong>{feature_name}</strong>.
            </p>
          </header>

          <div className="result-content">
            <div className="result-row">
              <span className="label">Risk Score</span>
              <span className="risk-score">{risk_score.toFixed(1)}%</span>
            </div>

            <div className="result-row">
              <span className="label">Risk Level</span>
              <span
                className={`badge ${
                  risk_level === "HIGH"
                    ? "badge-high"
                    : risk_level === "MEDIUM"
                    ? "badge-medium"
                    : "badge-low"
                }`}
              >
                {risk_level}
              </span>
            </div>

            <div className="result-recommendation">
              <span className="label">Recommendation</span>
              <p className="recommendation-text">{recommendation}</p>
            </div>
          </div>
        </section>

        <section className="card card-result">
          <header className="card-header">
            <h2 className="title">Top Risk Factors</h2>
            <p className="subtitle">
              These factors commonly drive higher failure risk.
            </p>
          </header>

          <div className="risk-factors">
            {factorLabel("Lines Changed", "High impact on churn", "high")}
            {factorLabel("Complexity Score", "Higher complexity increases risk", "high")}
            {factorLabel("Past Bug Count", "Historical instability indicator", "med")}
          </div>
        </section>
      </main>
    </div>
  );
};

