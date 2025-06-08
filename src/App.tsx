import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "~/App.css";
import HealthRecordForm from "~/components/HealthRecordForm";
import Layout from "~/components/Layout";
import BodyMap from "~/pages/BodyMap";
import HealthRecord from "~/pages/HealthRecord";
import Home from "~/pages/Home";
import Reports from "~/pages/Reports";
import type { RecordFormData } from "~/types";

function App() {
  const [recordFormData, setRecordFormData] = useState<RecordFormData>({
    data: {
      description: "",
      symptoms: [],
      status: {
        stage: "",
        progression: "",
        severity: "",
      },
      treatmentsTried: [],
      medicalConsultations: [],
      createdAt: new Date().toISOString(),
    },
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch("http://localhost:4444/health-records/1");
        const data = await res.json();
        setRecordFormData({ data, loading: false, error: "" });
      } catch (err) {
        setRecordFormData({
          ...recordFormData,
          loading: false,
          error: err instanceof Error ? err.message : "Unexpected error",
        });
      }
    };

    fetchRecord();
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-record" element={<HealthRecord />} />
          <Route
            path="/health-record/form"
            element={<HealthRecordForm recordFormData={recordFormData} setRecordFormData={setRecordFormData} />}
          />
          <Route path="/body-map" element={<BodyMap />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
