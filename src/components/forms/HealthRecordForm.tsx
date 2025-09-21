import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HealthStatusForm from "./HealthStatusForm";
import MedicalConsultationsForm from "./MedicalConsultationsForm";
import SymptomsForm from "./SymptomsForm";
import TreatmentsTried from "./TreatmentsTried";

import "~/utils/renderErrors.css";
import ChatWidget from "~/components/chat/ChatWidget";
import { getHealthRecord } from "~/services/api/healthRecordsApi";
import type { FormErrors } from "~/types/formErrors";
import type { HealthRecord, RecordFormData, Status, SymptomUI } from "~/types/types";
import { statusOptions } from "~/utils/constants";
import { renderErrors } from "~/utils/renderErrors";
import { Z_HealthRecord } from "~/validation/healthRecordSchema";

const HealthRecordForm = () => {
  const { id } = useParams<{ id: string }>();
  const [recordFormData, setRecordFormData] = useState<RecordFormData>({
    data: {
      description: "",
      symptoms: [],
      status: {
        stage: statusOptions.stage[0].value,
        severity: statusOptions.severity[0].value,
        progression: statusOptions.progression[0].value,
      },
      treatmentsTried: [],
      medicalConsultations: [],
    },
    loading: true,
    error: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors<HealthRecord>>({});
  const [isValid, setIsValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [touchedStatus, setTouchedStatus] = useState<{ [key in keyof Status]?: boolean }>({});
  const [touchedTreatments, setTouchedTreatments] = useState<boolean>(false);
  const [touchedSymptoms, setTouchedSymptoms] = useState<{ [index: number]: { [key in keyof SymptomUI]?: boolean } }>(
    {}
  );
  const [touchedConsultations, setTouchedConsultations] = useState<{
    [index: number]: {
      consultant?: boolean;
      date?: boolean;
      diagnosis?: boolean;
      followUpActions?: boolean[];
    };
  }>({});

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        if (id) {
          const record = await getHealthRecord(id);
          setRecordFormData({ data: record, loading: false, error: "" });
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
    validateForm();
  }, [data]);

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
    setTouchedConsultations((prev) => {
      const updated = { ...prev };
      newConsultations.forEach((_, i) => {
        if (!updated[i]) {
          updated[i] = {
            consultant: false,
            date: false,
            diagnosis: false,
            followUpActions: [],
          };
        }
      });

      return updated;
    });
    validateForm();
  };

  const handleSymptomChange = (index: number, field: keyof SymptomUI, value: string) => {
    setRecordFormData((prev) => {
      const updatedSymptoms = [...prev.data.symptoms];
      updatedSymptoms[index] = { ...updatedSymptoms[index], [field]: value };

      return { ...prev, data: { ...prev.data, symptoms: updatedSymptoms } };
    });
    validateForm();
  };

  const toggleSymptom = (index: number) => {
    setRecordFormData((prev) => {
      const updatedSymptoms = [...prev.data.symptoms];
      updatedSymptoms[index] = { ...updatedSymptoms[index], isOpen: !updatedSymptoms[index].isOpen };

      return { ...prev, data: { ...prev.data, symptoms: updatedSymptoms } };
    });
    validateForm();
  };

  const handleAddSymptom = () => {
    setRecordFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        symptoms: [
          ...prev.data.symptoms,
          {
            name: "",
            startDate: "",
            affectedParts: "Placeholder: affected parts coming soon",
            isOpen: true,
          },
        ],
      },
    }));
    validateForm();
  };

  const handleRemoveSymptom = (index: number) => {
    if (window.confirm("Are you sure you want to remove this symptom?")) {
      setRecordFormData((prev) => ({
        ...prev,
        data: { ...prev.data, symptoms: prev.data.symptoms.filter((_, i) => i !== index) },
      }));
      validateForm();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parseResult = Z_HealthRecord.safeParse(data);
    if (!parseResult.success) {
      setFormErrors(parseResult.error.format() as unknown as FormErrors<HealthRecord>);
      setIsValid(false);

      return;
    }
    console.log("Submitted record:", data);
  };

  const validateForm = () => {
    const parseResult = Z_HealthRecord.safeParse({
      ...data,
      symptoms: data.symptoms,
    });
    if (parseResult.success) {
      setFormErrors({});
      setIsValid(true);
    } else {
      const formattedErrors = parseResult.error.format() as unknown as FormErrors<HealthRecord>;
      setFormErrors(formattedErrors);
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
            onBlur={() => setTouchedFields((prev) => ({ ...prev, description: true }))}
            placeholder="Describe symptoms, context, or notes..."
            className={touchedFields.description && formErrors?.description ? "input-error" : ""}
          />
          {touchedFields.description && renderErrors(formErrors.description)}
        </div>
        <div className="form-section">
          <HealthStatusForm
            status={data.status}
            setStatus={setStatus}
            formErrors={formErrors.status}
            touchedFields={touchedStatus}
            setTouchedFields={(field) => setTouchedStatus((prev) => ({ ...prev, [field]: true }))}
          />
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
            touched={touchedTreatments}
            setTouched={() => setTouchedTreatments(true)}
          />
        </div>
        <div className="form-section">
          <SymptomsForm
            symptoms={data.symptoms}
            onSymptomChange={handleSymptomChange}
            toggleSymptom={toggleSymptom}
            addSymptom={handleAddSymptom}
            removeSymptom={handleRemoveSymptom}
            formErrors={formErrors.symptoms}
            touched={touchedSymptoms}
            setTouched={(index, field) =>
              setTouchedSymptoms((prev) => ({
                ...prev,
                [index]: { ...prev[index], [field]: true },
              }))
            }
          />
        </div>
        <div className="form-section">
          <MedicalConsultationsForm
            consultations={data.medicalConsultations}
            setConsultations={updateConsultations}
            formErrors={formErrors.medicalConsultations}
            touched={touchedConsultations}
            setTouched={(index, field, actionIndex) => {
              setTouchedConsultations((prev) => {
                const updated = { ...prev };
                if (!updated[index]) updated[index] = {};

                if (field === "followUpActions" && actionIndex !== undefined) {
                  if (!updated[index].followUpActions) updated[index].followUpActions = [];
                  updated[index].followUpActions[actionIndex] = true;
                } else if (field === "consultant" || field === "date" || field === "diagnosis") {
                  updated[index][field] = true;
                }

                return updated;
              });
            }}
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
