import Select from "react-select";

import "./HealthStatusForm.css";
import type { FormErrors } from "~/types/formErrors";
import type { Status } from "~/types/types";
import { statusOptions } from "~/utils/constants";
import { renderErrors } from "~/utils/renderErrors";

interface SelectOption {
  label: string;
  value: string;
}

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
      <div className="health-status-form">
        <div className="form-group">
          <label>Stage:</label>
          <Select<SelectOption>
            options={statusOptions.stage.map(({ label, value }) => ({
              label,
              value,
            }))}
            value={{
              label:
                statusOptions.stage.find((option) => option.value === status.stage)?.label ||
                statusOptions.stage[0].label,
              value: status.stage || statusOptions.stage[0].value,
            }}
            onChange={(selectedOption) => {
              setStatus("stage", selectedOption?.value || statusOptions.stage[0].value);
              setTouchedFields("stage");
            }}
            placeholder="Select stage"
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
          />
          {touchedFields.stage && renderErrors(formErrors?.stage)}
        </div>
        <div className="form-group">
          <label>Severity:</label>
          <Select<SelectOption>
            options={statusOptions.severity.map(({ label, value }) => ({
              label,
              value,
            }))}
            value={{
              label:
                statusOptions.severity.find((option) => option.value === status.severity)?.label ||
                statusOptions.severity[0].label,
              value: status.severity || statusOptions.severity[0].value,
            }}
            onChange={(selectedOption) => {
              setStatus("severity", selectedOption?.value || statusOptions.severity[0].value);
              setTouchedFields("severity");
            }}
            placeholder="Select severity"
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
          />
          {touchedFields.severity && renderErrors(formErrors?.severity)}
        </div>
        <div className="form-group">
          <label>Progression:</label>
          <Select<SelectOption>
            options={statusOptions.progression.map(({ label, value }) => ({
              label,
              value,
            }))}
            value={{
              label:
                statusOptions.progression.find((option) => option.value === status.progression)?.label ||
                statusOptions.progression[0].label,
              value: status.progression || statusOptions.progression[0].value,
            }}
            onChange={(selectedOption) => {
              setStatus("progression", selectedOption?.value || statusOptions.progression[0].value);
              setTouchedFields("progression");
            }}
            placeholder="Select progression"
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
          />
          {touchedFields.progression && renderErrors(formErrors?.progression)}
        </div>
      </div>
      {renderErrors(formErrors?._errors)}
    </div>
  );
};
export default HealthStatusForm;
