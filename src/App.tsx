import { BrowserRouter, Route, Routes } from "react-router-dom";

import "~/App.css";
import HealthRecordForm from "~/components/forms/HealthRecordForm";
import Layout from "~/components/Layout";
import Home from "~/pages/Home";
import Reports from "~/pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-record" element={<HealthRecordForm />} />
          <Route path="/health-record/:id/edit" element={<HealthRecordForm />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
