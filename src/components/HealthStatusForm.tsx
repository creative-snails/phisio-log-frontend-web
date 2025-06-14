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
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
        { label: "In-progress", value: "in-progress" },
      ],
      default: "open",
    },
    severity: {
      options: [
        { label: "Mild", value: "mild" },
        { label: "Moderate", value: "moderate" },
        { label: "Severe", value: "severe" },
        { label: "Variable", value: "variable" },
      ],
      default: "variable",
    },
    progression: {
      options: [
        { label: "Improving", value: "improving" },
        { label: "Stable", value: "stable" },
        { label: "Worsening", value: "worsening" },
        { label: "Variable", value: "variable" },
      ],
      default: "stable",
    },
  };

  return (
    <div className="health-status-form">
      <h2>Status</h2>
      {Object.entries(statusOptions).map(([field, config]) => (
        <div className="form-group" key={field}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          <select
            value={status[field as keyof Status] || config.default}
            onChange={(e) => setStatus(field as keyof Status, e.target.value)}
          >
            {config.options.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
export default HealthStatusForm;
