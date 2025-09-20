import Select from "react-select";

import "./HealthStatusForm.css";
import type { Status } from "~/types";

interface SelectOption {
  label: string;
  value: string;
}

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
    <div className="health-status-section">
      <div className="health-status-form">
        <div className="form-group">
          <label>Stage:</label>
          <Select<SelectOption>
            options={statusOptions.stage.options.map(({ display, value }) => ({
              label: display,
              value,
            }))}
            value={{
              label:
                statusOptions.stage.options.find(
                  (option) => option.value === (status.stage || statusOptions.stage.default)
                )?.display || "Open",
              value: status.stage || statusOptions.stage.default,
            }}
            onChange={(selectedOption) => setStatus("stage", selectedOption?.value || statusOptions.stage.default)}
            placeholder="Select stage"
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
          />
        </div>
        <div className="form-group">
          <label>Severity:</label>
          <Select<SelectOption>
            options={statusOptions.severity.options.map(({ display, value }) => ({
              label: display,
              value,
            }))}
            value={{
              label:
                statusOptions.severity.options.find(
                  (option) => option.value === (status.severity || statusOptions.severity.default)
                )?.display || "Variable",
              value: status.severity || statusOptions.severity.default,
            }}
            onChange={(selectedOption) =>
              setStatus("severity", selectedOption?.value || statusOptions.severity.default)
            }
            placeholder="Select severity"
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
          />
        </div>
        <div className="form-group">
          <label>Progression:</label>
          <Select<SelectOption>
            options={statusOptions.progression.options.map(({ display, value }) => ({
              label: display,
              value,
            }))}
            value={{
              label:
                statusOptions.progression.options.find(
                  (option) => option.value === (status.progression || statusOptions.progression.default)
                )?.display || "Stable",
              value: status.progression || statusOptions.progression.default,
            }}
            onChange={(selectedOption) =>
              setStatus("progression", selectedOption?.value || statusOptions.progression.default)
            }
            placeholder="Select progression"
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  );
};
export default HealthStatusForm;
