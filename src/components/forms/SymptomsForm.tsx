import SymptomFormCard from "./SymptomFormCard";

import "./SymptomsForm.css";
import type { FormErrors, Symptom, SymptomUI } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomsFormProps = {
  symptoms: SymptomUI[];
  onSymptomChange: (
    index: number,
    field: keyof SymptomUI,
    value: string | SymptomUI["affectedParts"] | undefined
  ) => void;
  onBodyPartChange: (index: number) => void;
  setCurrentSymptom: React.Dispatch<React.SetStateAction<Symptom | null>>;
  addSymptom: () => void;
  removeSymptom: (index: number) => void;
  formErrors?: FormErrors<SymptomUI[]>;
  touched?: { [index: number]: { [key in keyof SymptomUI]?: boolean } };
  setTouched?: (index: number, field: keyof SymptomUI) => void;
};

const SymptomsForm = ({
  symptoms,
  onSymptomChange,
  onBodyPartChange,
  setCurrentSymptom,
  addSymptom,
  removeSymptom,
  formErrors,
  touched,
  setTouched,
}: SymptomsFormProps) => {
  return (
    <div className="symptom-form-container">
      {symptoms.map((symptom, index) => (
        <SymptomFormCard
          key={index}
          index={index}
          symptom={symptom}
          onSymptomChange={onSymptomChange}
          onBodyPartChange={onBodyPartChange}
          setCurrentSymptom={setCurrentSymptom}
          removeSymptom={removeSymptom}
          formErrors={formErrors}
          touched={touched}
          setTouched={setTouched}
        />
      ))}
      <button type="button" className="add-button" onClick={addSymptom}>
        + Add Symptom
      </button>
      {Object.keys(touched || {}).length > 0 && renderErrors(formErrors?._errors)}
    </div>
  );
};

export default SymptomsForm;
