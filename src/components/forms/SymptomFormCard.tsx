import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaMinusCircle } from "react-icons/fa";
import AffectedBodyPartsInput from "./AffectedBodyPartsInput";

import type { BodyPart, BodyPartExtended, FormErrors, SeverityState, Symptom } from "~/types";
import { deriveSideFromKey } from "~/utils";
import { renderErrors } from "~/utils/renderErrors";

type SymptomFormCardProps = {
  index: number;
  symptom: Symptom;
  onSymptomChange: (id: string, field: keyof Symptom, value: string | BodyPart[]) => void;
  currentBodyPart: BodyPartExtended | null;
  setCurrentBodyPart: (bp: BodyPartExtended | null) => void;
  currentSymptom: Symptom | null;
  setCurrentSymptom: (symtom: Symptom | null) => void;
  removeSymptom: (id: string) => void;
  formErrors?: FormErrors<Symptom[]>;
  touched?: { [id: string]: { [key in keyof Symptom]?: boolean } };
  setTouched?: (id: string, field: keyof Symptom) => void;
};

const SymptomFormCard = ({
  index,
  symptom,
  onSymptomChange,
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

  const isActive = currentSymptom?.id === symptom.id;

  const isActiveRef = useRef(isActive);
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // keep refs for current selection to make setter consistent without re-creating callbacks
  const currentBodyPartRef = useRef(currentBodyPart);
  useEffect(() => {
    currentBodyPartRef.current = currentBodyPart;
  }, [currentBodyPart]);

  const setScopedCurrentBodyPart = useCallback((bp: BodyPartExtended | null, force = false) => {
    if (!force && !isActiveRef.current) return;

    const cur = currentBodyPartRef.current;
    if (cur && bp && cur.index === bp.index && cur.side == bp.side && cur.state === bp.state) return;

    setCurrentBodyPart(bp);
  }, []);

  const handleAddBodyPart = () => {
    const parts = symptom.affectedParts || [];
    const newBodyPart: BodyPart = { key: "", state: "0" as SeverityState };
    const newIndex = parts.length;

    // Ensure the card is active and selection points to the new row immediately
    if (!isActiveRef.current) setCurrentSymptom(symptom);
    setScopedCurrentBodyPart({ ...newBodyPart, index: newIndex, side: "front" }, true);

    const updatedParts: BodyPart[] = [...parts, newBodyPart];
    onSymptomChange(symptom.id, "affectedParts", updatedParts);
  };

  const handleRemoveBodyPart = (removeIndex: number) => {
    const parts = symptom.affectedParts || [];
    const updatedBodyParts = parts.filter((_, i) => i !== removeIndex);

    setCurrentSymptom(symptom);

    if (updatedBodyParts.length === 0) {
      setScopedCurrentBodyPart(null, true);
    } else {
      const current = isActiveRef.current && currentBodyPart ? currentBodyPart.index : null;
      let nextIndex: number;

      if (current === null) nextIndex = Math.min(removeIndex, updatedBodyParts.length - 1);
      else if (removeIndex < current) nextIndex = current - 1;
      else if (removeIndex === current) nextIndex = Math.min(current, updatedBodyParts.length - 1);
      else nextIndex = current;

      const bp = updatedBodyParts[nextIndex];
      setScopedCurrentBodyPart({ ...bp, index: nextIndex, side: deriveSideFromKey(bp.key) }, true);
    }

    onSymptomChange(symptom.id, "affectedParts", updatedBodyParts);
  };

  const handleUpdateBodyPart = useCallback(
    (index: number, property: keyof BodyPart, value: string | SeverityState) => {
      const parts = symptom.affectedParts || [];
      const current = parts[index];
      if (!current) return;

      if (property === "key" && current.key === value) return;
      if (property === "state" && current.state === value) return;

      const newParts = [...parts];
      newParts[index] = { ...current, [property]: value };
      onSymptomChange(symptom.id, "affectedParts", newParts);
    },
    [symptom.affectedParts, symptom.id]
  );

  // Atomic helper: select this card and set the body part in one go to avoid races
  const selectThisCardAndSetBodyPart = useCallback(
    (bp: BodyPartExtended | null) => {
      if (!isActiveRef.current) setCurrentSymptom(symptom);
      setScopedCurrentBodyPart(bp, true);
    },
    [symptom]
  );

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      setCurrentSymptom(symptom);
      const parts = symptom.affectedParts || [];
      if (parts.length > 0) {
        const index = parts.length - 1;
        const key = parts[index].key;
        const state = parts[index].state;
        const side = key.includes("-back") ? "back" : "front";
        setScopedCurrentBodyPart({ key, state, side, index }, true);
      } else {
        setScopedCurrentBodyPart(null, true);
      }
    } else if (isActive) {
      setCurrentSymptom(null);
      setScopedCurrentBodyPart(null, true);
    }
  };

  return (
    <div
      className={`symptom-card ${symptom.id === currentSymptom?.id ? "active" : ""}`}
      onClick={() => {
        if (!isOpen) return;
        if (!isActiveRef.current) {
          setCurrentSymptom(symptom);
          const parts = symptom.affectedParts || [];
          if (parts.length > 0) {
            const index = parts.length - 1;
            const key = parts[index].key;
            const state = parts[index].state;
            const side = key.includes("-back") ? "back" : "front";
            setScopedCurrentBodyPart({ key, state, side, index }, true);
          } else {
            setScopedCurrentBodyPart(null, true);
          }
        }
      }}
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
          <AffectedBodyPartsInput
            bodyParts={symptom.affectedParts || []}
            currentBodyPart={currentBodyPart}
            setScopedCurrentBodyPart={selectThisCardAndSetBodyPart}
            handleAddBodyPart={handleAddBodyPart}
            handleRemoveBodyPart={handleRemoveBodyPart}
            handleUpdateBodyPart={handleUpdateBodyPart}
            symptomId={symptom.id}
            activeSymptomId={currentSymptom?.id}
          />
          {renderErrors(formErrors?.[index]?.affectedParts)}
        </div>
      )}
    </div>
  );
};

export default SymptomFormCard;
