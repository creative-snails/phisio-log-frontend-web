import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HealthStatusForm from "./HealthStatusForm";
import MedicalConsultationsForm from "./MedicalConsultationsForm";
import SymptomsForm from "./SymptomsForm";
import TreatmentsTried from "./TreatmentsTried";

import ChatWidget from "~/components/chat/ChatWidget";
import { getHealthRecord } from "~/services/api/healthRecordsApi";
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
          const record = await getHealthRecord(id);
          setRecordFormData({ data: record, loading: false, error: "" });
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
      affectedParts: "Placeholder: affected parts coming soon",
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
    if (field === "name" || field === "startDate" || field === "affectedParts") {
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
    setSymptoms([
      ...symptoms,
      { name: "", startDate: "", affectedParts: "Placeholder: affected parts coming soon", isOpen: true },
    ]);
  };

  const handleRemoveSymptom = (index: number) => {
    if (window.confirm("Are you sure you want to remove this symptom?")) {
      const update = symptoms.filter((_, i) => i !== index);
      setSymptoms(update);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted record:", {
      description: data.description,
      treatmentsTried: data.treatmentsTried,
      status: data.status,
      medicalConsultations: data.medicalConsultations,
      symptoms,
    });
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div style={{ color: "red" }}>Error: {error}</div>
  ) : (
    <>
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <h2>Edit Health Record</h2>
        <div className="timestamps-container">
          {data.createdAt && (
            <p>
              <strong>Created: </strong>
              {new Date(data.createdAt).toLocaleString()}
            </p>
          )}
          {data.updatedAt && (
            <p>
              <strong>Updated: </strong>
              {new Date(data.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="form-section">
          <h3>Description</h3>
          <label htmlFor="description" className="sr-only">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={data.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Describe symptoms, context, or notes..."
          />
        </div>
        <div className="form-section">
          <HealthStatusForm status={data.status} setStatus={setStatus} />
        </div>
        <div className="form-section">
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
        <div className="form-section">
          <SymptomsForm
            symptoms={symptoms}
            onSymptomChange={handleSymptomChange}
            toggleSymptom={toggleSymptom}
            addSymptom={handleAddSymptom}
            removeSymptom={handleRemoveSymptom}
          />
        </div>
        <div className="form-section">
          <MedicalConsultationsForm consultations={data.medicalConsultations} setConsultations={updateConsultations} />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <ChatWidget healthRecordId={data.id} />
    </>
  );
};

export default HealthRecordForm;
