import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import BodyMapSelector from "./BodyMapSelector";
import HealthStatusForm from "./HealthStatusForm";
import MedicalConsultationsForm from "./MedicalConsultationsForm";
import SymptomsForm from "./SymptomsForm";
import TreatmentsTried from "./TreatmentsTried";

import "~/utils/renderErrors.css";
import BodyMapViewer from "~/components/BodyMapViewer";
import ChatWidget from "~/components/chat/ChatWidget";
import { getHealthRecord } from "~/services/api/healthRecordsApi";
import type { BodyPart, BodyPartExtended, FormErrors, HealthRecord, RecordFormData, Status, Symptom } from "~/types";
import { numericToLabel, statusOptions } from "~/utils/constants";
import { renderErrors } from "~/utils/renderErrors";
import { Z_HealthRecord } from "~/validation/healthRecordSchema";

const HealthRecordForm = () => {
  const { id } = useParams<{ id: string }>();
  const [isBodyMapOverlayOpen, setIsBodyMapOverlayOpen] = useState(false);
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
  const [touchedSymptoms, setTouchedSymptoms] = useState<{ [id: string]: { [key in keyof Symptom]?: boolean } }>({});
  const [touchedConsultations, setTouchedConsultations] = useState<{
    [index: number]: {
      consultant?: boolean;
      date?: boolean;
      diagnosis?: boolean;
      followUpActions?: boolean[];
    };
  }>({});
  const [currentSymptom, setCurrentSymptom] = useState<Symptom | null>(null);
  const [currentBodyPart, setCurrentBodyPart] = useState<BodyPartExtended | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        if (id) {
          const record = await getHealthRecord(id);
          setRecordFormData({
            data: record,
            loading: false,
            error: "",
          });
        } else {
          setRecordFormData((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        setRecordFormData({
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
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch record",
        });
      }
    };

    fetchRecord();
  }, [id]);

  const { data, loading, error } = recordFormData;

  useEffect(() => {
    validateForm();
  }, [data]);

  const handleDescriptionChange = (value: string) => {
    setRecordFormData((prev) => {
      const hasDescription = value.trim().length > 0;
      const shouldPopulateDefaults = hasDescription && !prev.data.description.trim();

      return {
        ...prev,
        data: {
          ...prev.data,
          description: value,
          // Auto-populate health status defaults when description is first provided
          status: shouldPopulateDefaults
            ? {
                stage: statusOptions.stage[0].value,
                severity: statusOptions.severity[0].value,
                progression: statusOptions.progression[1].value, // "stable" as default
              }
            : prev.data.status,
        },
      };
    });
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
          updated[i] = {};
        }
      });

      return updated;
    });
    validateForm();
  };

  const handleAddSymptom = () => {
    const newSymptom = {
      id: uuidv4(),
      name: "",
      startDate: "",
      affectedParts: [],
      isOpen: true,
    };

    setRecordFormData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        symptoms: [...prev.data.symptoms, newSymptom],
      },
    }));
    setCurrentSymptom(newSymptom);
    validateForm();
  };

  const handleSymptomChange = (id: string, field: keyof Symptom, value: string | BodyPart[]) => {
    setRecordFormData((prev) => {
      const updatedSymptoms = [...prev.data.symptoms];
      const index = updatedSymptoms.findIndex((s) => s.id === id);
      updatedSymptoms[index] = { ...updatedSymptoms[index], [field]: value };

      return { ...prev, data: { ...prev.data, symptoms: updatedSymptoms } };
    });
    validateForm();
    console.log("Updating symptom", field, value);
  };

  // const handleBodyPartChange = (symptomId: string) => {
  //   if (!currentBodyPart) return;

  //   setCurrentSymptom(
  //     (prev) => ({ ...prev, affectedParts: [...(prev?.affectedParts || []), currentBodyPart] }) as Symptom
  //   );

  //   setRecordFormData((prev) => {
  //     const updatedSymptoms = [...prev.data.symptoms];
  //     const index = updatedSymptoms.findIndex((s) => s.id === symptomId);
  //     const currentSymptom = updatedSymptoms[index];
  //     const newBodyPart = { key: currentBodyPart.key, state: currentBodyPart.state };

  //     updatedSymptoms[index] = {
  //       ...currentSymptom,
  //       affectedParts: [...(currentSymptom.affectedParts || []), newBodyPart],
  //     };

  //     return { ...prev, data: { ...prev.data, symptoms: updatedSymptoms } };
  //   });
  // };

  const handleRemoveSymptom = (id: string) => {
    if (window.confirm("Are you sure you want to remove this symptom?")) {
      setRecordFormData((prev) => ({
        ...prev,
        data: { ...prev.data, symptoms: prev.data.symptoms.filter((s) => s.id !== id) },
      }));
      validateForm();
    }
  };

  // useEffect(() => {
  //   if (currentSymptom) handleBodyPartChange(currentSymptom.id);
  // }, [currentBodyPart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert numeric severity to labels for validation
    const payloadForValidation = {
      ...data,
      symptoms: data.symptoms.map((symptom) => ({
        ...symptom,
        affectedParts: symptom.affectedParts?.map((part) => ({
          key: part.key,
          state: numericToLabel[part.state], // numeric → label
        })),
      })),
    };

    // Perform full validation before submission
    const parseResult = Z_HealthRecord.safeParse(payloadForValidation);
    if (!parseResult.success) {
      // Show all validation errors, including optional fields if they have invalid data
      const formattedErrors = parseResult.error.format() as unknown as FormErrors<HealthRecord>;
      setFormErrors(formattedErrors);

      return;
    }

    // Clean up data for backend submission - use empty strings consistently
    const cleanedData = {
      ...payloadForValidation,
      treatmentsTried: payloadForValidation.treatmentsTried.filter((treatment) => treatment.trim() !== ""),
      medicalConsultations: payloadForValidation.medicalConsultations.map((consultation) => ({
        ...consultation,
        diagnosis: consultation.diagnosis || "",
        followUpActions: consultation.followUpActions.filter((action) => action.trim() !== ""),
      })),
    };

    console.log("Submitted record:", cleanedData);
  };

  const validateForm = () => {
    // Convert numeric severity to labels for validation
    const payloadForValidation = {
      ...data,
      symptoms: data.symptoms.map((symptom) => ({
        ...symptom,
        affectedParts: symptom.affectedParts?.map((part) => ({
          key: part.key,
          state: numericToLabel[part.state], // numeric → label
        })),
      })),
    };
    // Validate all fields using the full schema
    const parseResult = Z_HealthRecord.safeParse(payloadForValidation);

    // Show validation errors for real-time feedback
    if (!parseResult.success) {
      const formattedErrors = parseResult.error.format() as unknown as FormErrors<HealthRecord>;
      // Remove errors for optional fields if they're empty to reduce noise
      const filteredErrors = { ...formattedErrors };

      // Only hide optional field errors if they're empty, not if they have invalid data
      if (data.treatmentsTried.length === 0) {
        delete filteredErrors.treatmentsTried;
      }
      if (data.medicalConsultations.length === 0) {
        delete filteredErrors.medicalConsultations;
      }

      setFormErrors(filteredErrors);
    } else {
      // No validation errors
      setFormErrors({});
    }

    // Button enabling logic: enable only when all validation passes
    setIsValid(parseResult.success);
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
                      onBlur={() => setTouchedFields((prev) => ({ ...prev, description: true }))}
                      placeholder="Share details about your symptoms, their impact, or any relevant context that might help track your health journey..."
                      className={touchedFields.description && formErrors?.description ? "input-error" : ""}
                    />
                    {touchedFields.description && renderErrors(formErrors.description)}
                  </div>
                </div>
              </div>

              <div className="form-group-section">
                <div className="form-group-header">
                  <h4>Health Status</h4>
                </div>
                <div className="form-group-items">
                  <div className="form-item">
                    <HealthStatusForm
                      status={data.status}
                      setStatus={setStatus}
                      formErrors={formErrors.status}
                      touchedFields={touchedStatus}
                      setTouchedFields={(field) => setTouchedStatus((prev) => ({ ...prev, [field]: true }))}
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
                      symptoms={data.symptoms}
                      onSymptomChange={handleSymptomChange}
                      // onBodyPartChange={handleBodyPartChange}
                      currentBodyPart={currentBodyPart}
                      setCurrentBodyPart={setCurrentBodyPart}
                      currentSymptom={currentSymptom}
                      setCurrentSymptom={setCurrentSymptom}
                      addSymptom={handleAddSymptom}
                      removeSymptom={handleRemoveSymptom}
                      formErrors={formErrors.symptoms}
                      touched={touchedSymptoms}
                      setTouched={(id, field) =>
                        setTouchedSymptoms((prev) => ({
                          ...prev,
                          [id]: { ...prev[id], [field]: true },
                        }))
                      }
                    />
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
                </div>
              </div>
            </div>
            <button type="submit" className="submit-button" disabled={!isValid}>
              Submit
            </button>
          </form>
        </div>
        <div className="body-map-section">
          <h2 className="dashboard-section-title bodymap-title">Body Map</h2>
          {currentSymptom ? (
            <BodyMapSelector
              currentSymptom={currentSymptom}
              currentBodyPart={currentBodyPart}
              setCurrentBodyPart={setCurrentBodyPart}
            />
          ) : (
            <BodyMapViewer records={data.id ? [data] : []} />
          )}
        </div>
      </div>

      {/* Body Map Toggle Tab */}
      <button className="body-map-tab" onClick={() => setIsBodyMapOverlayOpen(true)} title="View Body Map">
        <span>Body Map</span>
      </button>

      {/* Body Map Slide Panel */}
      <div className={`body-map-panel ${isBodyMapOverlayOpen ? "open" : ""}`}>
        <div className="body-map-panel-header">
          <h3>Body Map</h3>
          <button className="close-panel" onClick={() => setIsBodyMapOverlayOpen(false)} title="Close">
            ×
          </button>
        </div>
        <div className="body-map-panel-content">
          {currentSymptom ? (
            <BodyMapSelector
              currentSymptom={currentSymptom}
              currentBodyPart={currentBodyPart}
              setCurrentBodyPart={setCurrentBodyPart}
            />
          ) : (
            <BodyMapViewer records={data.id ? [data] : []} />
          )}
        </div>
      </div>

      {/* Backdrop when panel is open */}
      {isBodyMapOverlayOpen && <div className="body-map-backdrop" onClick={() => setIsBodyMapOverlayOpen(false)} />}

      <ChatWidget healthRecordId={data.id} />
    </div>
  );
};

export default HealthRecordForm;
