import { FaMinusCircle } from "react-icons/fa";

import "~/utils/renderErrors.css";
import "./TreatmentsTried.css";
import type { FormErrors } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type TreatmentsTriedProps = {
  treatments: string[];
  setTreatments: (treatments: string[]) => void;
  formErrors?: FormErrors<string[]>;
  touched?: boolean;
  setTouched?: () => void;
};

const TreatmentsTried = ({ treatments, setTreatments, formErrors, touched, setTouched }: TreatmentsTriedProps) => {
  const updateTreatments = (index: number, value: string) => {
    const updated = [...treatments];
    updated[index] = value;
    setTreatments(updated);
  };
  const addTreatment = () => setTreatments([...treatments, ""]);
  const removeTreatment = (index: number) => {
    const updated = [...treatments];
    updated.splice(index, 1);
    setTreatments(updated);
  };

  return (
    <div className="treatments-tried-container">
      {treatments.map((treatment, i) => (
        <div key={i} className="treatment-item">
          <input
            type="text"
            value={treatment}
            onChange={(e) => updateTreatments(i, e.target.value)}
            onBlur={setTouched}
            className={touched && formErrors?.[i]?._errors ? "input-error" : ""}
          />
          <button type="button" className="remove-button" onClick={() => removeTreatment(i)}>
            <FaMinusCircle className="remove-icon" />
          </button>
          {touched && renderErrors(formErrors?.[i])}
        </div>
      ))}
      <button type="button" className="add-button" onClick={addTreatment}>
        + Add Treatment
      </button>
      {touched && renderErrors(formErrors?._errors)}
    </div>
  );
};
export default TreatmentsTried;
