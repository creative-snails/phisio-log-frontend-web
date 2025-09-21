import { FaChevronDown, FaChevronUp, FaMinusCircle } from "react-icons/fa";

import "./SymptomsForm.css";
import type { FormErrors, SymptomUI } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomsFormProps = {
  symptoms: SymptomUI[];
  onSymptomChange: (index: number, field: keyof SymptomUI, value: string) => void;
  toggleSymptom: (index: number) => void;
  addSymptom: () => void;
  removeSymptom: (index: number) => void;
  formErrors?: FormErrors<SymptomUI[]>;
  touched?: { [index: number]: { [key in keyof SymptomUI]?: boolean } };
  setTouched?: (index: number, field: keyof SymptomUI) => void;
};

const SymptomsForm = ({
  symptoms,
  onSymptomChange,
  toggleSymptom,
  addSymptom,
  removeSymptom,
  formErrors,
  touched,
  setTouched,
}: SymptomsFormProps) => {
  return (
    <div className="symptom-form-container">
      {symptoms.map((symptom, index) => (
        <div key={index} className="symptom-card">
          <div className="symptom-header" onClick={() => toggleSymptom(index)}>
            <div className="symptom-header-content">
              {symptom.isOpen ? <FaChevronUp className="chevron-icon" /> : <FaChevronDown className="chevron-icon" />}
              <h4>{symptom.name || "New Symptom"}</h4>
            </div>
            <FaMinusCircle
              className="remove-icon"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                removeSymptom(index);
              }}
            />
          </div>

          {symptom.isOpen && (
            <div className="symptom-body">
              <label>Name</label>
              <input
                type="text"
                value={symptom.name}
                onChange={(e) => onSymptomChange(index, "name", e.target.value)}
                placeholder="Enter symptom name"
                onBlur={() => setTouched && setTouched(index, "name")}
                className={touched?.[index]?.name && formErrors?.[index]?.name?._errors ? "input-error" : ""}
              />
              {touched?.[index]?.name && renderErrors(formErrors?.[index]?.name)}

              <label>Start Date</label>
              <input
                type="date"
                value={symptom.startDate}
                onChange={(e) => onSymptomChange(index, "startDate", e.target.value)}
                onBlur={() => setTouched && setTouched(index, "startDate")}
                className={touched?.[index]?.startDate && formErrors?.[index]?.startDate?._errors ? "input-error" : ""}
              />
              {touched?.[index]?.startDate && renderErrors(formErrors?.[index]?.startDate)}

              <label>Affected Parts</label>
              <div className="placeholder">
                {Array.isArray(symptom.affectedParts) && symptom.affectedParts.length > 0
                  ? symptom.affectedParts
                      .map((part, i) => (
                        <span key={i}>
                          {part.key} (severity: {part.state})
                        </span>
                      ))
                      .join(", ")
                  : typeof symptom.affectedParts === "string"
                    ? symptom.affectedParts
                    : "No affected parts specified"}
              </div>
              {renderErrors(formErrors?.[index]?.affectedParts)}
            </div>
          )}
        </div>
      ))}
      <button type="button" className="add-button" onClick={addSymptom}>
        + Add Symptom
      </button>
      {Object.keys(touched || {}).length > 0 && renderErrors(formErrors?._errors)}
    </div>
  );
};

export default SymptomsForm;
