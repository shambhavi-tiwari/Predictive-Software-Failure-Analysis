import React from "react";
import { NavLink } from "react-router-dom";

export const NavigationBar: React.FC = () => {
  return (
    <header className="nav-bar">
      <div className="nav-inner">
        <div className="nav-brand">Feature Failure Predictor</div>
        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            Predict Risk
          </NavLink>
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            Risk Analysis
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            History
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

