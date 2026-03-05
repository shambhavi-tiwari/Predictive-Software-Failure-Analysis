import React, { useState } from "react";

type PredictionResponse = {
  feature_name: string;
  risk_score: number;
  risk_level: string;
  recommendation: string;
};

const API_BASE_URL = "http://localhost:8000";

export const FeatureFailurePredictor: React.FC = () => {
  const [form, setForm] = useState({
    feature_name: "",
    lines_changed: 0,
    files_changed: 0,
    complexity_score: 0,
    developer_experience: 0,
    past_bug_count: 0,
    commit_frequency: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "feature_name" ? value : Number(value || 0),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Prediction failed");
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const riskColorClass = (() => {
    if (!result) return "badge-low";
    if (result.risk_level === "HIGH") return "badge-high";
    if (result.risk_level === "MEDIUM") return "badge-medium";
    return "badge-low";
  })();

  return (
    <div className="page-root">
      <main className="layout">
        <section className="card card-form">
          <header className="card-header">
            <h1 className="title">Feature Failure Predictor</h1>
            <p className="subtitle">
              Predict the risk of software feature failure using machine
              learning.
            </p>
          </header>

          <div className="section-title">Change Metrics</div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-field form-field-full">
              <label htmlFor="feature_name">Feature Name</label>
              <input
                id="feature_name"
                name="feature_name"
                type="text"
                placeholder="e.g., Payment Validation"
                value={form.feature_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="lines_changed">Lines Changed</label>
              <input
                id="lines_changed"
                name="lines_changed"
                type="number"
                min={0}
                value={form.lines_changed}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="files_changed">Files Changed</label>
              <input
                id="files_changed"
                name="files_changed"
                type="number"
                min={0}
                value={form.files_changed}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="complexity_score">Complexity Score</label>
              <input
                id="complexity_score"
                name="complexity_score"
                type="number"
                min={0}
                value={form.complexity_score}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="developer_experience">
                Developer Experience (years)
              </label>
              <input
                id="developer_experience"
                name="developer_experience"
                type="number"
                min={0}
                value={form.developer_experience}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="past_bug_count">Past Bug Count</label>
              <input
                id="past_bug_count"
                name="past_bug_count"
                type="number"
                min={0}
                value={form.past_bug_count}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="commit_frequency">
                Commit Frequency (per week)
              </label>
              <input
                id="commit_frequency"
                name="commit_frequency"
                type="number"
                min={0}
                value={form.commit_frequency}
                onChange={handleChange}
              />
            </div>

            <div className="form-field form-field-full">
              <button
                type="submit"
                disabled={loading}
                className="primary-button"
              >
                {loading ? "Predicting..." : "Predict Failure Risk"}
              </button>
              {error && <p className="error-text">{error}</p>}
            </div>
          </form>

          <footer className="footer-caption">
            Feature Failure Predictor — ML-powered risk assessment
          </footer>
        </section>

        <section className="card card-result">
          <header className="card-header">
            <h2 className="title">Prediction Results</h2>
            <p className="subtitle">
              Risk assessment will appear after prediction.
            </p>
          </header>

          {!result && (
            <div className="result-placeholder">
              <div className="pulse-icon" />
              <p className="placeholder-text">
                Enter change metrics and click predict to see risk analysis.
              </p>
            </div>
          )}

          {result && (
            <div className="result-content">
              <div className="result-row">
                <span className="label">Feature</span>
                <span className="value">{result.feature_name}</span>
              </div>

              <div className="result-row">
                <span className="label">Risk Score</span>
                <span className="risk-score">
                  {result.risk_score.toFixed(1)}%
                </span>
              </div>

              <div className="result-row">
                <span className="label">Risk Level</span>
                <span className={`badge ${riskColorClass}`}>
                  {result.risk_level}
                </span>
              </div>

              <div className="result-recommendation">
                <span className="label">Recommendation</span>
                <p className="recommendation-text">
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}

          {result && result.risk_level === "HIGH" && (
            <div className="banner banner-warning">
              High risk detected. Review the recommendations carefully.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

