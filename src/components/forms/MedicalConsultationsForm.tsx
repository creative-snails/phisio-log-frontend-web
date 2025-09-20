import { useState } from "react";
import { FaMinusCircle } from "react-icons/fa";

import "./MedicalConsultationsForm.css";

type Consultation = {
  consultant: string;
  date: string;
  diagnosis: string;
  followUpActions: string[];
  isOpen?: boolean;
  isNew?: boolean;
};

type MedicalConsultationsFormProps = {
  consultations: Consultation[];
  setConsultations: (consultations: Consultation[]) => void;
};

const MedicalConsultationsForm = ({ consultations, setConsultations }: MedicalConsultationsFormProps) => {
  const [successMessage, setSuccessMessage] = useState("");

  const addConsultation = () => {
    setConsultations([
      ...consultations,
      {
        consultant: "",
        date: "",
        diagnosis: "",
        followUpActions: [""],
        isOpen: true,
        isNew: true,
      },
    ]);
  };

  const updateConsultation = <K extends keyof Consultation>(index: number, field: K, value: Consultation[K]) => {
    const update = [...consultations];
    update[index][field] = value;
    setConsultations(update);
    setSuccessMessage("");
  };

  const removeConsultation = (index: number) => {
    const update = [...consultations];
    update.splice(index, 1);
    setConsultations(update);
    setSuccessMessage("");
  };

  const updateAction = (i: number, j: number, value: string) => {
    const update = [...consultations];
    update[i].followUpActions[j] = value;
    setConsultations(update);
    setSuccessMessage("");
  };

  const addAction = (i: number) => {
    const update = [...consultations];
    update[i].followUpActions.push("");
    setConsultations(update);
    setSuccessMessage("");
  };

  const removeAction = (i: number, j: number) => {
    const update = [...consultations];
    update[i].followUpActions.splice(j, 1);
    setConsultations(update);
    setSuccessMessage("");
  };

  const toggleCol = (index: number) => {
    const update = [...consultations];
    update[index].isOpen = !update[index].isOpen;
    setConsultations(update);
  };

  return (
    <div className="Consultations-form-container">
      {consultations.map((c, i) => (
        <div key={i} className="consultation-card">
          <div className="consultation-header" onClick={() => toggleCol(i)}>
            {c.consultant && <h4>{c.consultant}</h4>}
            {c.diagnosis && <p className="diagnosis-summary">{c.diagnosis}</p>}
            {!c.consultant && !c.diagnosis && <h4>New Consultation</h4>}
            <FaMinusCircle
              className="remove-icon"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                removeConsultation(i);
              }}
            />
          </div>
          {c.isOpen && (
            <div className="consultation-body">
              <label>Consultant</label>
              <input
                type="text"
                value={c.consultant}
                onChange={(e) => updateConsultation(i, "consultant", e.target.value)}
              />

              <label>Date</label>
              <input type="date" value={c.date} onChange={(e) => updateConsultation(i, "date", e.target.value)} />

              <label>Diagnosis</label>
              <input
                type="text"
                value={c.diagnosis}
                onChange={(e) => updateConsultation(i, "diagnosis", e.target.value)}
              />

              <label>Follow-Up Action</label>
              <div className="follow-up-actions">
                {c.followUpActions.map((action, j) => (
                  <div key={j} className="action-item">
                    <input type="text" value={action} onChange={(e) => updateAction(i, j, e.target.value)} />
                    <button type="button" className="remove-button" onClick={() => removeAction(i, j)}>
                      <FaMinusCircle className="remove-icon" />
                    </button>
                  </div>
                ))}
                <button type="button" className="add-button" onClick={() => addAction(i)}>
                  + Add Action
                </button>
                {successMessage && <div className="success-message">{successMessage}</div>}
              </div>
            </div>
          )}
        </div>
      ))}
      <button type="button" className="add-button" onClick={addConsultation}>
        + Add Consultation
      </button>
    </div>
  );
};
export default MedicalConsultationsForm;
