import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HealthStatusForm from "./HealthStatusForm";
import MedicalConsultationsForm from "./MedicalConsultationsForm";
import SymptomsForm from "./SymptomsForm";
import TreatmentsTried from "./TreatmentsTried";

import "~/utils/renderErrors.css";
import ChatWidget from "~/components/chat/ChatWidget";
import type { FormErrors } from "~/types/formErrors";
import type { HealthRecord, RecordFormData, Status, SymptomUI } from "~/types/types";
import { renderErrors } from "~/utils/renderErrors";
import { Z_HealthRecord } from "~/validation/healthRecordSchema";

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
  const [formErrors, setFormErrors] = useState<FormErrors<HealthRecord>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        if (id) {
          const res = await fetch(`http://localhost:4444/health-records/${id}`);
          const data = await res.json();
          setRecordFormData({ data, loading: false, error: "" });
        } else {
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

  useEffect(() => {
    validateForm();
  }, [data, symptoms]);

  const handleDescriptionChange = (value: string) => {
    setRecordFormData((prev) => ({
      ...prev,
      data: { ...prev.data, description: value },
    }));
    validateForm();
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
    validateForm();
  };

  const updateConsultations = (newConsultations: HealthRecord["medicalConsultations"]) => {
    setRecordFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        medicalConsultations: newConsultations,
      },
    }));
    validateForm();
  };

  const handleSymptomChange = (index: number, field: keyof SymptomUI, value: string) => {
    const update = [...symptoms];
    if (field === "name" || field === "startDate" || field === "affectedParts") {
      update[index][field] = value;
    }
    setSymptoms(update);
    validateForm();
  };

  const toggleSymptom = (index: number) => {
    const update = [...symptoms];
    update[index].isOpen = !update[index].isOpen;
    setSymptoms(update);
    validateForm();
  };

  const handleAddSymptom = () => {
    setSymptoms([
      ...symptoms,
      { name: "", startDate: "", affectedParts: "Placeholder: affected parts coming soon", isOpen: true },
    ]);
    validateForm();
  };

  const handleRemoveSymptom = (index: number) => {
    if (window.confirm("Are you sure you want to remove this symptom?")) {
      const update = symptoms.filter((_, i) => i !== index);
      setSymptoms(update);
      validateForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parseResult = Z_HealthRecord.safeParse({ ...data, symptoms });
    if (!parseResult.success) {
      setFormErrors(parseResult.error.format() as unknown as FormErrors<HealthRecord>);
      setIsValid(false);

      return;
    }
    console.log("Submitted record:", {
      description: data.description,
      treatmentsTried: data.treatmentsTried,
      status: data.status,
      medicalConsultations: data.medicalConsultations,
      symptoms,
    });
  };

  const validateForm = () => {
    const normalizedSymptoms = symptoms.map((s) => ({
      ...s,
      startDate: s.startDate ? new Date(s.startDate) : undefined,
    }));
    const normalizedConsultations =
      data.medicalConsultations?.map((c) => ({
        ...c,
        date: c.date ? new Date(c.date) : undefined,
      })) ?? [];
    const parseResult = Z_HealthRecord.safeParse({
      ...data,
      symptoms: normalizedSymptoms,
      medicalConsultations: normalizedConsultations,
    });

    if (parseResult.success) {
      setFormErrors({});
      setIsValid(true);
    } else {
      const formattedErrors = parseResult.error.format() as unknown as FormErrors<HealthRecord>;
      setFormErrors(formattedErrors);
      console.log("Form validation errors:", parseResult.error.format);
      setIsValid(false);
    }
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
            className={formErrors?.description ? "input-error" : ""}
          />
          {renderErrors(formErrors.description)}
        </div>
        <div className="form-section">
          <HealthStatusForm status={data.status} setStatus={setStatus} formErrors={formErrors.status} />
        </div>
        <div className="form-section">
          <TreatmentsTried
            treatments={data.treatmentsTried}
            setTreatments={(updated) => {
              setRecordFormData((prev) => ({
                ...prev,
                data: { ...prev.data, treatmentsTried: updated },
              }));
              validateForm();
            }}
            formErrors={formErrors.treatmentsTried}
          />
        </div>
        <div className="form-section">
          <SymptomsForm
            symptoms={symptoms}
            onSymptomChange={handleSymptomChange}
            toggleSymptom={toggleSymptom}
            addSymptom={handleAddSymptom}
            removeSymptom={handleRemoveSymptom}
            formErrors={formErrors.symptoms}
          />
        </div>
        <div className="form-section">
          <MedicalConsultationsForm
            consultations={data.medicalConsultations}
            setConsultations={updateConsultations}
            formErrors={formErrors.medicalConsultations}
          />
        </div>
        <button type="submit" className="submit-button" disabled={!isValid}>
          Submit
        </button>
      </form>
      <ChatWidget healthRecordId={data.id} />
    </>
  );
};

export default HealthRecordForm;
