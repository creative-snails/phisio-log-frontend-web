import { FaRegTrashAlt } from "react-icons/fa";

import "./SymptomsForm.css";
import type { FormErrors } from "~/types/formErrors";
import type { SymptomUI } from "~/types/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomsFormProps = {
  symptoms: SymptomUI[];
  onSymptomChange: (index: number, field: keyof SymptomUI, value: string) => void;
  toggleSymptom: (index: number) => void;
  addSymptom: () => void;
  removeSymptom: (index: number) => void;
  formErrors?: FormErrors<SymptomUI[]>;
};

const SymptomsForm = ({
  symptoms,
  onSymptomChange,
  toggleSymptom,
  addSymptom,
  removeSymptom,
  formErrors,
}: SymptomsFormProps) => {
  return (
    <div className="symptom-form-container">
      <h3>Symptoms</h3>
      {symptoms.map((symptom, index) => (
        <div key={index} className="symptom-card">
          <div className="symptom-header" onClick={() => toggleSymptom(index)}>
            <h4>{symptom.name}</h4>
          </div>
          <FaRegTrashAlt
            className="trash-icon"
            onClick={(e) => {
              e.stopPropagation();
              removeSymptom(index);
            }}
          />

          {symptom.isOpen && (
            <div className="symptom-body">
              <label>Name</label>
              <input
                type="text"
                value={symptom.name}
                onChange={(e) => onSymptomChange(index, "name", e.target.value)}
                placeholder="Enter symptom name"
                className={formErrors?.[index]?._errors ? "input-error" : ""}
              />
              {renderErrors(formErrors?.[index]?.name)}

              <label>Start Date</label>
              <input
                type="date"
                value={symptom.startDate}
                onChange={(e) => onSymptomChange(index, "startDate", e.target.value)}
                className={formErrors?.[index]?._errors ? "input-error" : ""}
              />
              {renderErrors(formErrors?.[index]?.startDate)}

              <label>Affected Parts</label>
              <div className="placeholder">{symptom.affectedParts}</div>
              {renderErrors(formErrors?.[index]?.affectedParts)}
            </div>
          )}
        </div>
      ))}
      <button type="button" className="add-button" onClick={addSymptom}>
        + Add Symptom
      </button>
      {renderErrors(formErrors?._errors)}
    </div>
  );
};

export default SymptomsForm;
