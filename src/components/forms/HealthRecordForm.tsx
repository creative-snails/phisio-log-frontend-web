import { useEffect, useState } from "react";
import HealthStatusForm from "./HealthStatusForm";
import MedicalConsultationsForm from "./MedicalConsultationsForm";
import SymptomsFormSection from "./SymptomsForm";
import TreatmentsTried from "./TreatmentsTried";

import ChatWidget from "~/components/chat/ChatWidget";
import type { HealthRecord, RecordFormData, Status, SymptomUI } from "~/types";

interface HealthRecordFormProps {
  recordFormData: RecordFormData;
  setRecordFormData: React.Dispatch<React.SetStateAction<RecordFormData>>;
}

const HealthRecordForm = ({ recordFormData, setRecordFormData }: HealthRecordFormProps) => {
  const { data, loading, error } = recordFormData;
  const [symptoms, setSymptoms] = useState<SymptomUI[]>([]);

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
        <div className="form-group">
          <label htmlFor="description">Description</label>
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
          <SymptomsFormSection
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
