import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HealthStatusForm from "./HealthStatusForm";
import MedicalConsultationsForm from "./MedicalConsultationsForm";
import SymptomsForm from "./SymptomsForm";
import TreatmentsTried from "./TreatmentsTried";

import BodyMapViewer from "~/components/BodyMapViewer";
import ChatWidget from "~/components/chat/ChatWidget";
import type { HealthRecord, RecordFormData, Status, SymptomUI } from "~/types";

const HealthRecordForm = () => {
  const { id } = useParams<{ id: string }>();
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
    },
    loading: true,
    error: "",
  });
  const [symptoms, setSymptoms] = useState<SymptomUI[]>([]);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        if (id) {
          const res = await fetch(`http://localhost:4444/health-records/${id}`);
          const data = await res.json();
          setRecordFormData({ data, loading: false, error: "" });
        } else {
          // Handle new record case
          setRecordFormData((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        setRecordFormData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unexpected error",
        }));
      }
    };

    fetchRecord();
  }, [id]);

  const { data, loading, error } = recordFormData;

  useEffect(() => {
    const loadedSymptoms = (data.symptoms || []).map((s: SymptomUI) => ({
      ...s,
      isOpen: false,
    }));
    setSymptoms(loadedSymptoms);
  }, [data.symptoms]);

  const handleDescriptionChange = (value: string) => {
    setRecordFormData((prev) => ({
      ...prev,
      data: { ...prev.data, description: value },
    }));
  };

  const setStatus = (field: keyof Status, value: string) => {
    setRecordFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        status: {
          ...prev.data.status,
          [field]: value,
        },
      },
    }));
  };

  const updateConsultations = (newConsultations: HealthRecord["medicalConsultations"]) => {
    setRecordFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        medicalConsultations: newConsultations,
      },
    }));
  };

  const handleSymptomChange = (index: number, field: keyof SymptomUI, value: string) => {
    const update = [...symptoms];
    if (field === "name" || field === "startDate") {
      update[index][field] = value;
    }
    setSymptoms(update);
  };

  const toggleSymptom = (index: number) => {
    const update = [...symptoms];
    update[index].isOpen = !update[index].isOpen;
    setSymptoms(update);
  };

  const handleAddSymptom = () => {
    setSymptoms([...symptoms, { name: "", startDate: "", isOpen: true }]);
  };

  const handleRemoveSymptom = (index: number) => {
    if (window.confirm("Are you sure you want to remove this symptom?")) {
      const update = symptoms.filter((_, i) => i !== index);
      setSymptoms(update);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form submitted successfully
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div style={{ color: "red" }}>Error: {error}</div>
  ) : (
    <div className="health-record-page">
      <div className="health-dashboard">
        <div className="form-section-wrapper">
          <h2 className="dashboard-section-title form-title">{id ? "Edit Health Record" : "Add Health Record"}</h2>
          {data.createdAt && (
            <div className="timestamps-container">
              <p>
                <strong>Created: </strong>
                {new Date(data.createdAt).toLocaleString()}
              </p>
              {data.updatedAt && (
                <p>
                  <strong>Updated: </strong>
                  {new Date(data.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
          <form className="form-timeline-wrapper" onSubmit={handleSubmit}>
            <div className="form-timeline">
              <div className="form-group-section">
                <div className="form-group-header">
                  <h4>General Information</h4>
                </div>
                <div className="form-group-items">
                  <div className="form-item">
                    <label htmlFor="description" className="sr-only">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={data.description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Share details about your symptoms, their impact, or any relevant context that might help track your health journey..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-section">
                <div className="form-group-header">
                  <h4>Health Status</h4>
                </div>
                <div className="form-group-items">
                  <div className="form-item">
                    <HealthStatusForm status={data.status} setStatus={setStatus} />
                  </div>
                </div>
              </div>

              <div className="form-group-section">
                <div className="form-group-header">
                  <h4>Treatments & Therapies</h4>
                </div>
                <div className="form-group-items">
                  <div className="form-item">
                    <TreatmentsTried
                      treatments={data.treatmentsTried}
                      setTreatments={(updated) =>
                        setRecordFormData((prev) => ({
                          ...prev,
                          data: { ...prev.data, treatmentsTried: updated },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-section">
                <div className="form-group-header">
                  <h4>Symptoms & Body Parts</h4>
                </div>
                <div className="form-group-items">
                  <div className="form-item">
                    <SymptomsForm
                      symptoms={symptoms}
                      onSymptomChange={handleSymptomChange}
                      toggleSymptom={toggleSymptom}
                      addSymptom={handleAddSymptom}
                      removeSymptom={handleRemoveSymptom}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group-section">
                <div className="form-group-header">
                  <h4>Medical Consultations</h4>
                </div>
                <div className="form-group-items">
                  <div className="form-item">
                    <MedicalConsultationsForm
                      consultations={data.medicalConsultations}
                      setConsultations={updateConsultations}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
        <div className="body-map-section">
          <h2 className="dashboard-section-title bodymap-title">Body Map</h2>
          <BodyMapViewer records={data.id ? [data] : []} />
        </div>
      </div>
      <ChatWidget healthRecordId={data.id} />
    </div>
  );
};

export default HealthRecordForm;
