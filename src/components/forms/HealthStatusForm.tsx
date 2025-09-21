import "./HealthStatusForm.css";
import type { FormErrors } from "~/types/formErrors";
import type { Status } from "~/types/types";
import { statusOptions } from "~/utils/constants";
import { renderErrors } from "~/utils/renderErrors";

interface HealthStatusFormProps {
  status: Status;
  setStatus: (field: keyof Status, value: string) => void;
  formErrors?: FormErrors<Status>;
  touchedFields: { [key in keyof Status]?: boolean };
  setTouchedFields: (field: keyof Status) => void;
}

const HealthStatusForm = ({
  status,
  setStatus,
  formErrors,
  touchedFields,
  setTouchedFields,
}: HealthStatusFormProps) => {
  return (
    <div className="health-status-section">
      <h3 className="section-title">Status</h3>
      <div className="health-status-form">
        {Object.entries(statusOptions).map(([field, options]) => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <select
              value={status[field as keyof Status]}
              onChange={(e) => setStatus(field as keyof Status, e.target.value)}
              onBlur={() => setTouchedFields(field as keyof Status)}
              className={
                touchedFields[field as keyof Status] && formErrors?.[field as keyof Status] ? "input-error" : ""
              }
            >
              {options.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {touchedFields[field as keyof Status] && renderErrors(formErrors?.[field as keyof Status])}
          </div>
        ))}
      </div>
      {renderErrors(formErrors?._errors)}
    </div>
  );
};
export default HealthStatusForm;
