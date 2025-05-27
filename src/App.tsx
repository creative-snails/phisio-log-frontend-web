import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import BodyMap from "./pages/BodyMap";
import HealthRecord from "./pages/HealthRecord";
import Home from "./pages/Home";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/health-record" element={<HealthRecord />} />
        <Route path="/body-map" element={<BodyMap />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Layout>
  );
}

export default App;
