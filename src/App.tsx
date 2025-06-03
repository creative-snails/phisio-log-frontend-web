import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "~/App.css";
import Layout from "~/components/Layout";
import BodyMap from "~/pages/BodyMap";
import HealthRecord from "~/pages/HealthRecord";
import Home from "~/pages/Home";
import Reports from "~/pages/Reports";
import HealthRecordForm from "~/components/HealthRecordForm";
import type { HealthRecord as HealthRecordType } from "~/types";

function App() {
  const [recordData, setRecordData] = useState<HealthRecordType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch("http://localhost:4444/health-records/1");
        if (!res.ok) throw new Error("Health record not found");
        const data: HealthRecordType = await res.json();
        setRecordData(data);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!recordData) return <div>No data found</div>;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health-record" element={<HealthRecord />} />
          <Route
            path="/health-record/form"
            element={
              <HealthRecordForm
                description={recordData.description}
                treatments={recordData.treatmentsTried}
                createdAt={new Date(recordData.createdAt)}
                updatedAt={new Date(recordData.updatedAt)}
              />
            }
          />
          <Route path="/body-map" element={<BodyMap />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
