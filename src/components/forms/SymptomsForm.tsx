import SymptomFormCard from "./SymptomFormCard";

import "./SymptomsForm.css";
import type { BodyPart, BodyPartExtended, FormErrors, Symptom } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomsFormProps = {
  symptoms: Symptom[];
  onSymptomChange: (id: string, field: keyof Symptom, value: string | BodyPart[]) => void;
  // onBodyPartChange: (key: string) => void;
  currentBodyPart: BodyPartExtended | null;
  setCurrentBodyPart: React.Dispatch<React.SetStateAction<BodyPartExtended | null>>;
  currentSymptom: Symptom | null;
  setCurrentSymptom: React.Dispatch<React.SetStateAction<Symptom | null>>;
  addSymptom: () => void;
  removeSymptom: (id: string) => void;
  formErrors?: FormErrors<Symptom[]>;
  touched?: { [id: string]: { [key in keyof Symptom]?: boolean } };
  setTouched?: (id: string, field: keyof Symptom) => void;
};

const SymptomsForm = ({
  symptoms,
  onSymptomChange,
  // onBodyPartChange,
  currentBodyPart,
  setCurrentBodyPart,
  currentSymptom,
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
          key={symptom.id}
          index={index}
          symptom={symptom}
          onSymptomChange={onSymptomChange}
          // onBodyPartChange={onBodyPartChange}
          currentBodyPart={currentBodyPart}
          setCurrentBodyPart={setCurrentBodyPart}
          currentSymptom={currentSymptom}
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
