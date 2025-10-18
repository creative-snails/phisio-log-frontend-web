import SymptomFormCard from "./SymptomFormCard";

import "./SymptomsForm.css";
import type { BodyPart, BodyPartExtended, FormErrors, Symptom } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomsFormProps = {
  symptoms: Symptom[];
  onSymptomChange: (id: string, field: keyof Symptom, value: string | BodyPart[]) => void;
  currentBodyPart: BodyPartExtended | null;
  setCurrentBodyPart: (bp: BodyPartExtended | null) => void;
  currentSymptom: Symptom | null;
  setCurrentSymptom: (sym: Symptom | null) => void;
  addSymptom: () => void;
  removeSymptom: (id: string) => void;
  formErrors?: FormErrors<Symptom[]>;
  touched?: { [id: string]: { [key in keyof Symptom]?: boolean } };
  setTouched?: (id: string, field: keyof Symptom) => void;
};

const SymptomsForm = ({
  symptoms,
  onSymptomChange,
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
          key={symptom.id + index}
          index={index}
          symptom={symptom}
          onSymptomChange={onSymptomChange}
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
