import "./HealthStatusForm.css";
import type { FormErrors } from "~/types/formErrors";
import type { Status } from "~/types/types";
import { renderErrors } from "~/utils/renderErrors";

interface HealthStatusFormProps {
  status: Status;
  setStatus: (field: keyof Status, value: string) => void;
  formErrors?: FormErrors<Status>;
}

const HealthStatusForm = ({ status, setStatus, formErrors }: HealthStatusFormProps) => {
  const statusOptions = {
    stage: {
      options: [
        { display: "Open", value: "open" },
        { display: "Closed", value: "closed" },
        { display: "In-progress", value: "in-progress" },
      ],
      default: "open",
    },
    severity: {
      options: [
        { display: "Mild", value: "mild" },
        { display: "Moderate", value: "moderate" },
        { display: "Severe", value: "severe" },
        { display: "Variable", value: "variable" },
      ],
      default: "variable",
    },
    progression: {
      options: [
        { display: "Improving", value: "improving" },
        { display: "Stable", value: "stable" },
        { display: "Worsening", value: "worsening" },
        { display: "Variable", value: "variable" },
      ],
      default: "stable",
    },
  };

  return (
    <div className="health-status-section">
      <h3 className="section-title">Status</h3>
      <div className="health-status-form">
        <div className="form-group">
          <label>Stage:</label>
          <select
            value={status.stage || statusOptions.stage.default}
            onChange={(e) => setStatus("stage", e.target.value)}
            className={formErrors?.stage ? "input-error" : ""}
          >
            {statusOptions.stage.options.map(({ display, value }) => (
              <option key={value} value={value}>
                {display}
              </option>
            ))}
          </select>
          {renderErrors(formErrors?.stage)}
        </div>
        <div className="form-group">
          <label>Severity:</label>
          <select
            value={status.severity || statusOptions.severity.default}
            onChange={(e) => setStatus("severity", e.target.value)}
            className={formErrors?.severity ? "input-error" : ""}
          >
            {statusOptions.severity.options.map(({ display, value }) => (
              <option key={value} value={value}>
                {display}
              </option>
            ))}
          </select>
          {renderErrors(formErrors?.severity)}
        </div>
        <div className="form-group">
          <label>Progression:</label>
          <select
            value={status.progression || statusOptions.progression.default}
            onChange={(e) => setStatus("progression", e.target.value)}
            className={formErrors?.progression ? "input-error" : ""}
          >
            {statusOptions.progression.options.map(({ display, value }) => (
              <option key={value} value={value}>
                {display}
              </option>
            ))}
          </select>
          {renderErrors(formErrors?.progression)}
        </div>
      </div>
      {renderErrors(formErrors?._errors)}
    </div>
  );
};
export default HealthStatusForm;
