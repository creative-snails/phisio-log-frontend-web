import { FaRegTrashAlt } from "react-icons/fa";

import "./SymptomsForm.css";
import type { SymptomUI } from "~/types";

type SymptomsFormSectionProps = {
  symptoms: SymptomUI[];
  onSymptomChange: (index: number, field: keyof SymptomUI, value: string) => void;
  toggleSymptom: (index: number) => void;
  addSymptom: () => void;
  removeSymptom: (index: number) => void;
};

const SymptomsFormSection = ({
  symptoms,
  onSymptomChange,
  toggleSymptom,
  addSymptom,
  removeSymptom,
}: SymptomsFormSectionProps) => {
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
              />

              <label>Start Date</label>
              <input
                type="date"
                value={symptom.startDate}
                onChange={(e) => onSymptomChange(index, "startDate", e.target.value)}
              />

              <label>Affected Parts</label>
              <div className="placeholder">{symptom.affectedParts}</div>
            </div>
          )}
        </div>
      ))}
      <button type="button" className="add-button" onClick={addSymptom}>
        + Add Symptom
      </button>
    </div>
  );
};

export default SymptomsFormSection;
