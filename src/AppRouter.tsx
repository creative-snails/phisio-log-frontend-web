import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import HealthCardList from "./HealthCardList";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/health-records" element={<HealthCardList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
