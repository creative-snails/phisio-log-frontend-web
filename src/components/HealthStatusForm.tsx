import "./HealthStatusForm.css";
import type { Status } from "~/types";

interface HealthStatusFormProps {
  status: Status;
  setStatus: (field: keyof Status, value: string) => void;
}

const HealthStatusForm = ({ status, setStatus }: HealthStatusFormProps) => {
  const stageOptions = ["open", "closed", "in-progress"];
  const severityOptions = ["mild", "moderate", "severe", "variable"];
  const progressionOptions = ["improving", "stable", "worsening", "variable"];

  const handleCancel = () => {
    console.log("Cancelled changes");
    setStatus("stage", "");
    setStatus("severity", "");
    setStatus("progression", "");
  };

  return (
    <div className="health-status-form">
      <h2>Status</h2>
      <div className="form-group">
        <label>Stage:</label>
        <select value={status.stage} onChange={(e) => setStatus("stage", e.target.value)}>
          <option value="">Select</option>
          {stageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Severity:</label>
        <select value={status.severity} onChange={(e) => setStatus("severity", e.target.value)}>
          <option value="">Select</option>
          {severityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Progression:</label>
        <select value={status.progression} onChange={(e) => setStatus("progression", e.target.value)}>
          <option value="">Select</option>
          {progressionOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="button-group">
        <button
          type="submit"
          className="save-button"
          onClick={() => {
            console.log("Saved status:", status);
          }}
        >
          Save
        </button>
        <button type="button" onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
};
export default HealthStatusForm;
