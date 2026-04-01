import React from "react";
import type { Prediction } from "../App";

type PredictionHistoryPageProps = {
  history: Prediction[];
};

const formatDate = (iso: string) => {
  try {
    const dt = new Date(iso);
    return dt.toLocaleString();
  } catch {
    return iso;
  }
};

export const PredictionHistoryPage: React.FC<PredictionHistoryPageProps> = ({
  history,
}) => {
  return (
    <div className="page-root">
      <main className="layout">
        <section className="card card-form">
          <header className="card-header">
            <h1 className="title">Prediction History</h1>
            <p className="subtitle">
              Review past risk assessments for your features.
            </p>
          </header>

          {history.length === 0 ? (
            <p className="placeholder-text">
              No predictions recorded yet. Run a prediction to start building
              history.
            </p>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Feature Name</th>
                    <th>Risk Score</th>
                    <th>Risk Level</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={`${item.feature_name}-${item.date}-${index}`}>
                      <td>{item.feature_name}</td>
                      <td>{item.risk_score.toFixed(1)}%</td>
                      <td>
                        <span
                          className={`badge ${
                            item.risk_level === "HIGH"
                              ? "badge-high"
                              : item.risk_level === "MEDIUM"
                              ? "badge-medium"
                              : "badge-low"
                          }`}
                        >
                          {item.risk_level}
                        </span>
                      </td>
                      <td>{formatDate(item.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

