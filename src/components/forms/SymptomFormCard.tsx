import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaMinusCircle } from "react-icons/fa";
import AffectedBodyPartsInput from "./AffectedBodyPartsInput";

import type { BodyPartExtended, FormErrors, Symptom } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomFormCardProps = {
  index: number;
  symptom: Symptom;
  onSymptomChange: (id: string, field: keyof Symptom, value: string | undefined) => void;
  // onBodyPartChange: (key: string) => void;
  currentBodyPart: BodyPartExtended | null;
  setCurrentBodyPart: React.Dispatch<React.SetStateAction<BodyPartExtended | null>>;
  currentSymptom: Symptom | null;
  setCurrentSymptom: React.Dispatch<React.SetStateAction<Symptom | null>>;
  removeSymptom: (id: string) => void;
  formErrors?: FormErrors<Symptom[]>;
  touched?: { [id: string]: { [key in keyof Symptom]?: boolean } };
  setTouched?: (id: string, field: keyof Symptom) => void;
};

const SymptomFormCard = ({
  index,
  symptom,
  onSymptomChange,
  // onBodyPartChange,
  currentBodyPart,
  setCurrentBodyPart,
  currentSymptom,
  setCurrentSymptom,
  removeSymptom,
  formErrors,
  touched,
  setTouched,
}: SymptomFormCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isOpen) setCurrentSymptom(symptom);
    // onBodyPartChange(index);
  }, [isOpen, symptom]);

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (!newIsOpen) setCurrentSymptom(null);
  };

  return (
    <div
      className={`symptom-card ${symptom.id === currentSymptom?.id ? "active" : ""}`}
      onClick={() => isOpen && setCurrentSymptom(symptom)}
    >
      <div className="symptom-header" onClick={handleHeaderClick}>
        <div className="symptom-header-content">
          {isOpen ? <FaChevronUp className="chevron-icon" /> : <FaChevronDown className="chevron-icon" />}
          <h4>{symptom.name || "New Symptom"}</h4>
        </div>
        <FaMinusCircle
          className="remove-icon"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            removeSymptom(symptom.id);
          }}
        />
      </div>

      {isOpen && (
        <div className="symptom-body">
          <label>Name</label>
          <input
            type="text"
            value={symptom.name}
            onChange={(e) => onSymptomChange(symptom.id, "name", e.target.value)}
            placeholder="Enter symptom name"
            onBlur={() => setTouched && setTouched(symptom.id, "name")}
            className={touched?.[symptom.id]?.name && formErrors?.[index]?.name?._errors ? "input-error" : ""}
          />
          {touched?.[symptom.id]?.name && renderErrors(formErrors?.[index]?.name)}

          <label>Start Date</label>
          <input
            type="date"
            value={symptom.startDate}
            onChange={(e) => onSymptomChange(symptom.id, "startDate", e.target.value)}
            onBlur={() => setTouched && setTouched(symptom.id, "startDate")}
            className={touched?.[symptom.id]?.startDate && formErrors?.[index]?.startDate?._errors ? "input-error" : ""}
          />
          {touched?.[symptom.id]?.startDate && renderErrors(formErrors?.[index]?.startDate)}

          <label>Affected Parts</label>
          <AffectedBodyPartsInput currentBodyPart={currentBodyPart} setCurrentBodyPart={setCurrentBodyPart} />
          {renderErrors(formErrors?.[index]?.affectedParts)}
        </div>
      )}
    </div>
  );
};

export default SymptomFormCard;
