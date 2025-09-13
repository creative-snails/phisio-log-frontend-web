import "~/utils/renderErrors.css";
import "./TreatmentsTried.css";
import type { FormErrors } from "~/types/formErrors";
import { renderErrors } from "~/utils/renderErrors";

type TreatmentsTriedProps = {
  treatments: string[];
  setTreatments: (treatments: string[]) => void;
  formErrors?: FormErrors<string[]>;
};

const TreatmentsTried = ({ treatments, setTreatments, formErrors }: TreatmentsTriedProps) => {
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
      <h3>Treatments Tried</h3>
      {treatments.map((treatment, i) => (
        <div key={i} className="treatment-item">
          <input
            type="text"
            value={treatment}
            onChange={(e) => updateTreatments(i, e.target.value)}
            className={formErrors?.[i]?._errors ? "input-error" : ""}
          />
          <button type="button" className="remove-button" onClick={() => removeTreatment(i)}>
            X
          </button>
          {renderErrors(formErrors?.[i])}
        </div>
      ))}
      <button type="button" className="add-button" onClick={addTreatment}>
        + Add Treatment
      </button>
      {renderErrors(formErrors?._errors)}
    </div>
  );
};
export default TreatmentsTried;
