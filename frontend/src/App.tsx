import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { PredictRiskPage } from "./components/PredictRiskPage";
import { RiskAnalysisPage } from "./components/RiskAnalysisPage";
import { PredictionHistoryPage } from "./components/PredictionHistoryPage";

export type Prediction = {
  feature_name: string;
  risk_score: number;
  risk_level: string;
  recommendation: string;
  date: string;
};

const HISTORY_STORAGE_KEY = "predictionHistory";

export const App: React.FC = () => {
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(
    null,
  );
  const [history, setHistory] = useState<Prediction[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed: Prediction[] = JSON.parse(stored);
        setHistory(parsed);
        if (parsed.length > 0) {
          setLatestPrediction(parsed[0]);
        }
      }
    } catch {
      // ignore malformed localStorage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore storage errors (e.g., private mode)
    }
  }, [history]);

  const handleNewPrediction = (
    prediction: Omit<Prediction, "date">,
  ): void => {
    const withDate: Prediction = {
      ...prediction,
      date: new Date().toISOString(),
    };
    setLatestPrediction(withDate);
    setHistory((prev) => [withDate, ...prev]);
  };

  return (
    <>
      <NavigationBar />
      <Routes>
        <Route
          path="/"
          element={
            <PredictRiskPage
              latestPrediction={latestPrediction}
              onNewPrediction={handleNewPrediction}
            />
          }
        />
        <Route
          path="/analysis"
          element={<RiskAnalysisPage latestPrediction={latestPrediction} />}
        />
        <Route
          path="/history"
          element={<PredictionHistoryPage history={history} />}
        />
      </Routes>
    </>
  );
};

