/* eslint-disable simple-import-sort/imports */
import { useEffect, useMemo, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import BodyMapViewer from "~/components/BodyMapViewer";
import ChatWidget from "~/components/chat/ChatWidget";
import { getHealthRecord } from "~/services/api/healthRecordsApi";
import { deriveSideFromKey, selectionReducer } from "~/state/selection";
import type { BodyPart, BodyPartExtended, FormErrors, HealthRecord, RecordFormData, Status, Symptom } from "~/types";
import { numericToLabel, statusOptions } from "~/utils/constants";
import { renderErrors } from "~/utils/renderErrors";
import "~/utils/renderErrors.css";
import { Z_HealthRecord } from "~/validation/healthRecordSchema";

import BodyMapSelector from "./BodyMapSelector";
import HealthStatusForm from "./HealthStatusForm";
import MedicalConsultationsForm from "./MedicalConsultationsForm";
import SymptomsForm from "./SymptomsForm";
import TreatmentsTried from "./TreatmentsTried";

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
  const [selection, dispatchSelection] = useReducer(selectionReducer, {
    symptomId: null,
    index: null,
    side: "front",
  });

  // Derived currentSymptom and currentBodyPart from selection + record data
  const currentSymptom: Symptom | null = useMemo(() => {
    if (!selection.symptomId) return null;

    return recordFormData.data.symptoms.find((s) => s.id === selection.symptomId) || null;
  }, [recordFormData.data.symptoms, selection.symptomId]);

  const currentBodyPart: BodyPartExtended | null = useMemo(() => {
    if (!currentSymptom) return null;
    if (selection.index == null) return null;
    const parts = currentSymptom.affectedParts || [];
    const part = parts[selection.index];
    if (!part) return null;
    // Prefer selection.side for UI; derive from key as fallback
    const side = (selection.side ?? deriveSideFromKey(part.key)) as "front" | "back";

    return { key: part.key, state: part.state, side, index: selection.index };
  }, [currentSymptom, selection.index, selection.side]);

  // Wrapper setters to keep children API stable while using pointer internally
  const setCurrentSymptom = (sym: Symptom | null) => {
    if (!sym) {
      dispatchSelection({ type: "SELECT_CARD", symptomId: null, parts: [] });

      return;
    }
    dispatchSelection({ type: "SELECT_CARD", symptomId: sym.id, parts: sym.affectedParts || [] });
  };

  const setCurrentBodyPart = (bp: BodyPartExtended | null) => {
    if (!currentSymptom) {
      dispatchSelection({ type: "SELECT_CARD", symptomId: null, parts: [] });

      return;
    }
    if (!bp) {
      dispatchSelection({ type: "SELECT_PART", index: null });

      return;
    }
    const side = (bp.side === "back" ? "back" : "front") as "front" | "back";
    dispatchSelection({ type: "SELECT_PART", index: bp.index, side });

    // Consolidated state update: handle side-flip reset, dedup, and mirroring in one go
    if (typeof bp.index === "number" && bp.index >= 0) {
      setRecordFormData((prev) => {
        const updatedSymptoms = [...prev.data.symptoms];
        const sIdx = updatedSymptoms.findIndex((s) => s.id === currentSymptom.id);
        if (sIdx === -1) return prev;
        const parts = updatedSymptoms[sIdx].affectedParts || [];
        const existing = parts[bp.index];
        if (!existing) return prev;

        const existingSide = deriveSideFromKey(existing.key);
        // Determine the new key to write: clear if side changed relative to existing key
        const newKeyCandidate = existing.key && existingSide !== side ? "" : bp.key;

        // If another row already has this key under the same symptom, move selection there to avoid duplicates
        if (newKeyCandidate) {
          const duplicateIdx = parts.findIndex((p, i) => i !== bp.index && p.key === newKeyCandidate);
          if (duplicateIdx !== -1) {
            const dupSide = deriveSideFromKey(newKeyCandidate);
            dispatchSelection({ type: "SELECT_PART", index: duplicateIdx, side: dupSide });

            return prev; // No write, just switch selection
          }
        }

        const desired = { key: newKeyCandidate, state: bp.state };
        if (parts[bp.index].key === desired.key && parts[bp.index].state === desired.state) return prev;
        const nextParts = [...parts];
        nextParts[bp.index] = desired;
        updatedSymptoms[sIdx] = { ...updatedSymptoms[sIdx], affectedParts: nextParts };

        return { ...prev, data: { ...prev.data, symptoms: updatedSymptoms } };
      });
    }
  };

  // No need for reconciliation effect: SELECT_CARD action sets a valid selection atomically

  // Guarantee: if an active card has parts but no selection, select the last part by default
  useEffect(() => {
    if (!currentSymptom) return;
    const parts = currentSymptom.affectedParts || [];
    if (parts.length > 0 && selection.index == null) {
      const idx = parts.length - 1;
      const side = deriveSideFromKey(parts[idx]?.key);
      dispatchSelection({ type: "SELECT_PART", index: idx, side });
    }
  }, [currentSymptom?.id, selection.index]);

  // Global selection guard: if nothing is selected but there are symptoms with parts,
  // auto-select the last part of the first such symptom.
  useEffect(() => {
    if (selection.symptomId) return;
    const firstWithParts = recordFormData.data.symptoms.find((s) => (s.affectedParts?.length || 0) > 0);
    if (!firstWithParts) return;
    const idx = (firstWithParts.affectedParts?.length || 1) - 1;
    const side = deriveSideFromKey(firstWithParts.affectedParts?.[idx]?.key || "");
    dispatchSelection({ type: "SELECT_CARD", symptomId: firstWithParts.id, parts: firstWithParts.affectedParts || [] });
    dispatchSelection({ type: "SELECT_PART", index: idx, side });
  }, [recordFormData.data.symptoms, selection.symptomId]);

  // If the active card has no parts but other cards do, move selection to the nearest card with parts
  useEffect(() => {
    const symptoms = recordFormData.data.symptoms;
    if (!symptoms.length) return;
    const anyWithParts = symptoms.some((s) => (s.affectedParts?.length || 0) > 0);
    if (!anyWithParts) return;

    const activeHasParts = !!(currentSymptom && (currentSymptom.affectedParts?.length || 0) > 0);
    if (activeHasParts) return;

    // Choose a target symptom with parts: prefer same index position if possible, else first with parts
    const currentIdx = symptoms.findIndex((s) => s.id === selection.symptomId);
    const targetIdx = currentIdx !== -1 ? currentIdx : 0;
    // Scan outward from targetIdx to find closest symptom with parts
    let chosen = undefined as Symptom | undefined;
    const n = symptoms.length;
    for (let radius = 0; radius < n; radius++) {
      const left = targetIdx - radius;
      const right = targetIdx + radius;
      const candidates: (Symptom | undefined)[] = [];
      if (left >= 0) candidates.push(symptoms[left]);
      if (right < n) candidates.push(symptoms[right]);
      for (const c of candidates) {
        if (c && (c.affectedParts?.length || 0) > 0) {
          chosen = c;
          break;
        }
      }
      if (chosen) break;
    }

    if (!chosen) return;

    const parts = chosen.affectedParts || [];
    const idx = parts.length - 1;
    const side = deriveSideFromKey(parts[idx]?.key);
    dispatchSelection({ type: "SELECT_CARD", symptomId: chosen.id, parts });
    dispatchSelection({ type: "SELECT_PART", index: idx, side });
  }, [recordFormData.data.symptoms, currentSymptom?.id, currentSymptom?.affectedParts?.length]);

  // Mirror map selection into the active symptom’s affectedParts in the central form state.
  useEffect(() => {
    if (!currentSymptom) return;
    if (!currentBodyPart) return;

    setRecordFormData((prev) => {
      const updatedSymptoms = [...prev.data.symptoms];
      const sIdx = updatedSymptoms.findIndex((s) => s.id === currentSymptom.id);
      if (sIdx === -1) return prev;
      const parts = updatedSymptoms[sIdx].affectedParts || [];
      const idx = currentBodyPart.index;
      if (!parts[idx]) return prev;
      const desired = { key: currentBodyPart.key, state: currentBodyPart.state };
      if (parts[idx].key === desired.key && parts[idx].state === desired.state) return prev;
      const nextParts = [...parts];
      nextParts[idx] = desired;
      updatedSymptoms[sIdx] = { ...updatedSymptoms[sIdx], affectedParts: nextParts };

      return { ...prev, data: { ...prev.data, symptoms: updatedSymptoms } };
    });
  }, [currentBodyPart, currentSymptom?.id]);

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

  const handleRemoveSymptom = (id: string) => {
    if (window.confirm("Are you sure you want to remove this symptom?")) {
      // Compute the next selection target before mutating state
      const curSymptoms = recordFormData.data.symptoms;
      const removedIdx = curSymptoms.findIndex((s) => s.id === id);
      const updatedSymptoms = curSymptoms.filter((s) => s.id !== id);

      setRecordFormData((prev) => ({
        ...prev,
        data: { ...prev.data, symptoms: updatedSymptoms },
      }));

      // Adjust selection: if we removed the active symptom, move selection to a nearby one with parts
      if (selection.symptomId === id) {
        if (updatedSymptoms.length === 0) {
          dispatchSelection({ type: "SELECT_CARD", symptomId: null, parts: [] });
          dispatchSelection({ type: "SELECT_PART", index: null });
        } else {
          // Pick the closest index (same position or previous if last removed)
          const targetIdx = Math.min(Math.max(removedIdx, 0), updatedSymptoms.length - 1);
          // Prefer the closest symptom that actually has parts
          let chosen = updatedSymptoms[targetIdx];
          if (!(chosen.affectedParts && chosen.affectedParts.length)) {
            chosen = updatedSymptoms.find((s) => s.affectedParts && s.affectedParts.length) || updatedSymptoms[0];
          }
          const parts = chosen.affectedParts || [];
          dispatchSelection({ type: "SELECT_CARD", symptomId: chosen.id, parts });
          if (parts.length) {
            const idx = parts.length - 1;
            const side = deriveSideFromKey(parts[idx]?.key);
            dispatchSelection({ type: "SELECT_PART", index: idx, side });
          } else {
            dispatchSelection({ type: "SELECT_PART", index: null });
          }
        }
      }
      validateForm();
    }
  };

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
