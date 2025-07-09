import { useEffect, useState } from "react";
import HealthStatusForm from "./HealthStatusForm";
import SymptomsFormSection from "./SymptomsForm";

import type { RecordFormData, Status, SymptomUI } from "~/types";

interface HealthRecordFormProps {
  recordFormData: RecordFormData;
  setRecordFormData: React.Dispatch<React.SetStateAction<RecordFormData>>;
}

const HealthRecordForm = ({ recordFormData, setRecordFormData }: HealthRecordFormProps) => {
  const { data, loading, error } = recordFormData;

  const [newTreatment, setNewTreatment] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

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

  const handleAddOrUpdateTreatment = () => {
    const trimmed = newTreatment.trim();
    if (!trimmed) return;

    setRecordFormData((prev) => {
      const updatedTreatments = [...prev.data.treatmentsTried];
      if (editIndex !== null) {
        updatedTreatments[editIndex] = trimmed;
      } else {
        updatedTreatments.push(trimmed);
      }

      return {
        ...prev,
        data: {
          ...prev.data,
          treatmentsTried: updatedTreatments,
        },
      };
    });

    setNewTreatment("");
    setEditIndex(null);
  };

  const handleEditTreatment = (index: number) => {
    setEditIndex(index);
    setNewTreatment(data.treatmentsTried[index]);
  };

  const handleRemoveTreatment = (index: number) => {
    setRecordFormData((prev) => {
      const updated = [...prev.data.treatmentsTried];
      updated.splice(index, 1);

      return {
        ...prev,
        data: { ...prev.data, treatmentsTried: updated },
      };
    });

    if (editIndex === index) {
      setEditIndex(null);
      setNewTreatment("");
    }
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
      symptoms,
    });
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div style={{ color: "red" }}>Error: {error}</div>
  ) : (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <h2>Edit Health Record</h2>
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
      <HealthStatusForm status={data.status} setStatus={setStatus} />
      <div className="form-group">
        <label>Treatments Tried</label>
        <div className="treatment-input">
          <input
            type="text"
            value={newTreatment}
            onChange={(e) => setNewTreatment(e.target.value)}
            placeholder="Enter a treatment"
          />
          <button
            type="button"
            className={editIndex !== null ? "update-button" : "add-button"}
            onClick={handleAddOrUpdateTreatment}
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>
        <ul className="treatment-list">
          {data.treatmentsTried.map((treatment, i) => (
            <li key={i}>
              {treatment}
              <div>
                <button
                  type="button"
                  className="edit-button"
                  style={{ marginRight: "0.5rem" }}
                  onClick={() => handleEditTreatment(i)}
                >
                  Edit
                </button>
                <button type="button" className="remove-button" onClick={() => handleRemoveTreatment(i)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <SymptomsFormSection
          symptoms={symptoms}
          onSymptomChange={handleSymptomChange}
          toggleSymptom={toggleSymptom}
          addSymptom={handleAddSymptom}
          removeSymptom={handleRemoveSymptom}
        />
      </div>
      <div className="form-group" style={{ fontSize: "0.7rem", color: "#555" }}>
        {data.createdAt && (
          <p>
            <strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}
          </p>
        )}
        {data.updatedAt && (
          <p>
            <strong>Updated:</strong> {new Date(data.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default HealthRecordForm;
