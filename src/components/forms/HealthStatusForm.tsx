import "./HealthStatusForm.css";
import type { Status } from "~/types";

interface HealthStatusFormProps {
  status: Status;
  setStatus: (field: keyof Status, value: string) => void;
}

const HealthStatusForm = ({ status, setStatus }: HealthStatusFormProps) => {
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
    <div className="health-status-form">
      <h3>Status</h3>
      <div className="form-group">
        <label>Stage:</label>
        <select
          value={status.stage || statusOptions.stage.default}
          onChange={(e) => setStatus("stage", e.target.value)}
        >
          {statusOptions.stage.options.map(({ display, value }) => (
            <option key={value} value={value}>
              {display}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Severity:</label>
        <select
          value={status.severity || statusOptions.severity.default}
          onChange={(e) => setStatus("severity", e.target.value)}
        >
          {statusOptions.severity.options.map(({ display, value }) => (
            <option key={value} value={value}>
              {display}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Progression:</label>
        <select
          value={status.progression || statusOptions.progression.default}
          onChange={(e) => setStatus("progression", e.target.value)}
        >
          {statusOptions.progression.options.map(({ display, value }) => (
            <option key={value} value={value}>
              {display}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default HealthStatusForm;
