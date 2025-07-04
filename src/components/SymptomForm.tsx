import "./SymptomForm.css";
import type { SymptomUI } from "~/types";

type SymptomFormSectionProps = {
  symptoms: SymptomUI[];
  onSymptomChange: (index: number, field: keyof SymptomUI, value: string) => void;
  toggleSymptom: (index: number) => void;
  addSymptom: () => void;
  removeSymptom: (index: number) => void;
};

const SymptomFormSection = ({
  symptoms,
  onSymptomChange,
  toggleSymptom,
  addSymptom,
  removeSymptom,
}: SymptomFormSectionProps) => {
  return (
    <div className="symptom-form-container">
      <h2>Symptoms</h2>
      {symptoms.map((symptom, index) => (
        <div key={index} className="symptom-card">
          <div className="symptom-header" onClick={() => toggleSymptom(index)}>
            <h4>Symptom {index + 1}</h4>
          </div>

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
              <button
                type="button"
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSymptom(index);
                }}
              >
                Remove
              </button>
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

export default SymptomFormSection;
