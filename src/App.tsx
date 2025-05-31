import { BrowserRouter, Route, Routes } from "react-router-dom";

import "~/App.css";
import Layout from "~/components/Layout";
import BodyMap from "~/pages/BodyMap";
import HealthRecord from "~/pages/HealthRecord";
import Home from "~/pages/Home";
import Reports from "~/pages/Reports";
import HealthRecordForm from "~/components/HealthRecordForm";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-record" element={<HealthRecord />} />
          <Route path="/health-record/new" element={<HealthRecordForm />} />
          <Route path="/body-map" element={<BodyMap />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
