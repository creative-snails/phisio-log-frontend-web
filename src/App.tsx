import React from "react";
import { Link } from "react-router-dom";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <nav>
        <h1>Welcome to Health Records</h1>
        <Link to="/health-records" className="nav-link">
          View Health Records
        </Link>
      </nav>
    </div>
  );
};

export default App;
//git add .
//git commit -m "describe what you have done"
//git push origin main
