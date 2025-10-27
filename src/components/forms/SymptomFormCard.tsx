import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaMinusCircle } from "react-icons/fa";
import AffectedBodyPartsInput from "./AffectedBodyPartsInput";

import type { BodyPart, BodyPartExtended, BodyPartInput, FormErrors, SeverityState, Symptom } from "~/types";
import { renderErrors } from "~/utils/renderErrors";

type SymptomFormCardProps = {
  index: number;
  symptom: Symptom;
  onSymptomChange: (id: string, field: keyof Symptom, value: string | BodyPart[]) => void;
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
  const [bodyParts, setBodyParts] = useState<BodyPartInput[]>([]);

  useEffect(() => {
    const initialBodyParts: BodyPartInput[] =
      symptom?.affectedParts?.map((bp) => ({
        side: bp.key.includes("-back") ? "back" : "front",
        key: bp.key,
        state: bp.state,
      })) || [];
    setBodyParts(initialBodyParts);
  }, [symptom.id, symptom.affectedParts]);

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
    const newBodyPart = { side: "front", key: "", state: "" as SeverityState };
    const updatedBodyParts = [...bodyParts, newBodyPart];

    setBodyParts(updatedBodyParts);

    if (!isActiveRef.current) setCurrentSymptom(symptom);
    setScopedCurrentBodyPart({ ...newBodyPart, index: updatedBodyParts.length - 1 }, true);

    onSymptomChange(
      symptom.id,
      "affectedParts",
      updatedBodyParts.map((bp) => ({ key: bp.key, state: bp.state }))
    );
  };

  const handleRemoveBodyPart = (removeIndex: number) => {
    const updatedBodyParts = bodyParts.filter((_, i) => i !== removeIndex);

    setBodyParts(updatedBodyParts);
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

      setScopedCurrentBodyPart({ ...updatedBodyParts[nextIndex], index: nextIndex }, true);
    }

    onSymptomChange(
      symptom.id,
      "affectedParts",
      updatedBodyParts.map((bp) => ({ key: bp.key, state: bp.state }))
    );
  };

  const handleUpdateBodyPart = useCallback(
    (index: number, property: keyof BodyPartInput, value: string | SeverityState) => {
      const current = bodyParts[index];
      if (!current) return;

      if (property === "side" && current.side === value) return;
      if (property === "key" && current.key === value) return;
      if (property === "state" && current.state === value) return;

      const updatedBodyParts = [...bodyParts];
      updatedBodyParts[index] = { ...updatedBodyParts[index], [property]: value };

      setBodyParts(updatedBodyParts);
      onSymptomChange(
        symptom.id,
        "affectedParts",
        updatedBodyParts.map((bp) => ({ key: bp.key, state: bp.state }))
      );
    },
    [bodyParts, symptom.id]
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

  // Keep the side dropdown in sync when the body map is fillped (two-way binding)
  useEffect(() => {
    if (!isActiveRef.current) return;
    if (!currentBodyPart) return;

    const { index: selectedIndex, side: selectedSide } = currentBodyPart;
    const current = bodyParts[selectedIndex];
    if (!current) return;
    if (current.side === selectedSide) return;

    const updated = [...bodyParts];
    updated[selectedIndex] = { ...current, side: selectedSide };
    setBodyParts(updated);
  }, [currentBodyPart?.side]);

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
            currentBodyPart={currentBodyPart}
            bodyParts={bodyParts}
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
