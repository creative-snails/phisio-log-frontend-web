import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaMinusCircle } from "react-icons/fa";

import type { FormErrors, Symptom } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomFormCardProps = {
  index: number;
  symptom: Symptom;
  onSymptomChange: (index: number, field: keyof Symptom, value: string | undefined) => void;
  onBodyPartChange: (index: number) => void;
  setCurrentSymptom: React.Dispatch<React.SetStateAction<Symptom | null>>;
  removeSymptom: (index: number) => void;
  formErrors?: FormErrors<Symptom[]>;
  touched?: { [index: number]: { [key in keyof Symptom]?: boolean } };
  setTouched?: (index: number, field: keyof Symptom) => void;
};

const SymptomFormCard = ({
  index,
  symptom,
  onSymptomChange,
  onBodyPartChange,
  setCurrentSymptom,
  removeSymptom,
  formErrors,
  touched,
  setTouched,
}: SymptomFormCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) setCurrentSymptom(symptom);
    onBodyPartChange(index);
  }, [isOpen, symptom]);

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (!newIsOpen) setCurrentSymptom(null);
  };

  return (
    <div className="symptom-card" onClick={() => isOpen && setCurrentSymptom(symptom)}>
      <div className="symptom-header" onClick={handleHeaderClick}>
        <div className="symptom-header-content">
          {isOpen ? <FaChevronUp className="chevron-icon" /> : <FaChevronDown className="chevron-icon" />}
          <h4>{symptom.name || "New Symptom"}</h4>
        </div>
        <FaMinusCircle
          className="remove-icon"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            removeSymptom(index);
          }}
        />
      </div>

      {isOpen && (
        <div className="symptom-body">
          <label>Name</label>
          <input
            type="text"
            value={symptom.name}
            onChange={(e) => onSymptomChange(index, "name", e.target.value)}
            placeholder="Enter symptom name"
            onBlur={() => setTouched && setTouched(index, "name")}
            className={touched?.[index]?.name && formErrors?.[index]?.name?._errors ? "input-error" : ""}
          />
          {touched?.[index]?.name && renderErrors(formErrors?.[index]?.name)}

          <label>Start Date</label>
          <input
            type="date"
            value={symptom.startDate}
            onChange={(e) => onSymptomChange(index, "startDate", e.target.value)}
            onBlur={() => setTouched && setTouched(index, "startDate")}
            className={touched?.[index]?.startDate && formErrors?.[index]?.startDate?._errors ? "input-error" : ""}
          />
          {touched?.[index]?.startDate && renderErrors(formErrors?.[index]?.startDate)}

          <label>Affected Parts</label>
          <div className="placeholder"></div>
          {renderErrors(formErrors?.[index]?.affectedParts)}
        </div>
      )}
    </div>
  );
};

export default SymptomFormCard;
