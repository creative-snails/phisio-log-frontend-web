import { FaMinusCircle } from "react-icons/fa";
import Select from "react-select";

import "./AffectedBodyPartsInput.css";
import type { BodyPartExtended, BodyPartInput, SeverityState } from "~/types";

interface SelectOption {
  label: string;
  value: string;
}

const sides: SelectOption[] = [
  { value: "front", label: "Front" },
  { value: "back", label: "Back" },
];

const frontSideParts: SelectOption[] = [
  {
    value: "head-front",
    label: "Head",
  },
  {
    value: "neck-left-front",
    label: "Neck Left",
  },
  {
    value: "neck-right-front",
    label: "Neck Right",
  },
  {
    value: "shoulder-left-front",
    label: "Shoulder Left",
  },
  {
    value: "shoulder-right-front",
    label: "Shoulder Right",
  },
  {
    value: "upper-arm-left-front",
    label: "Upper Arm Left",
  },
  {
    value: "upper-arm-right-front",
    label: "Upper Arm Right",
  },
  {
    value: "elbow-left-front",
    label: "Elbow Left",
  },
  {
    value: "elbow-right-front",
    label: "Elbow Right",
  },
  {
    value: "forearm-left-front",
    label: "Forearm Left",
  },
  {
    value: "forearm-right-front",
    label: "Forearm Right",
  },
  {
    value: "wrist-left-front",
    label: "Wrist Left",
  },
  {
    value: "wrist-right-front",
    label: "Wrist Right",
  },
  {
    value: "hand-left-front",
    label: "Hand Left",
  },
  {
    value: "hand-right-front",
    label: "Hand Right",
  },
  {
    value: "chest-left",
    label: "Chest",
  },
  {
    value: "chest-right",
    label: "Chest",
  },
  {
    value: "upper-abdomen-left",
    label: "Upper Abdomen",
  },
  {
    value: "upper-abdomen-right",
    label: "Upper Abdomen",
  },
  {
    value: "lower-abdomen-left",
    label: "Lower Abdomen",
  },
  {
    value: "lower-abdomen-right",
    label: "Lower Abdomen",
  },
  {
    value: "hip-left-front",
    label: "Hip Left",
  },
  {
    value: "hip-right-front",
    label: "Hip Right",
  },
  {
    value: "thigh-left-front",
    label: "Thigh Left",
  },
  {
    value: "thigh-right-front",
    label: "Thigh Right",
  },
  {
    value: "knee-left-front",
    label: "Knee Left",
  },
  {
    value: "knee-right-front",
    label: "Knee Right",
  },
  {
    value: "lower-leg-left-front",
    label: "Lower Leg Left",
  },
  {
    value: "lower-leg-right-front",
    label: "Lower Leg Right",
  },
  {
    value: "ankle-left-front",
    label: "Ankle Left",
  },
  {
    value: "ankle-right-front",
    label: "Ankle Right",
  },
  {
    value: "foot-left-front",
    label: "Foot Left",
  },
  {
    value: "foot-right-front",
    label: "Foot Right",
  },
];

const backSideParts: SelectOption[] = [
  {
    value: "head-back",
    label: "Head",
  },
  {
    value: "shoulder-right-back",
    label: "Shoulder Right",
  },
  {
    value: "upper-arm-right-back",
    label: "Upper Arm Right",
  },
  {
    value: "elbow-right-back",
    label: "Elbow Right",
  },
  {
    value: "forearm-right-back",
    label: "Forearm Right",
  },
  {
    value: "wrist-right-back",
    label: "Wrist Right",
  },
  {
    value: "hand-right-back",
    label: "Hand Right",
  },
  {
    value: "knee-right-back",
    label: "Knee Right",
  },
  {
    value: "lower-leg-right-back",
    label: "Lower Leg Right",
  },
  {
    value: "ankle-right-back",
    label: "Ankle Right",
  },
  {
    value: "foot-right-back",
    label: "Foot Right",
  },
  {
    value: "buttocks-right",
    label: "Buttocks Right",
  },
  {
    value: "middle-back-right",
    label: "Middle Back Right",
  },
  {
    value: "thigh-right-back",
    label: "Thigh Right",
  },
  {
    value: "shoulder-blade-right",
    label: "Shoulder Blade Right",
  },
  {
    value: "neck-right-back",
    label: "Neck Right",
  },
  {
    value: "upper-spine-right",
    label: "Upper Spine Right",
  },
  {
    value: "lower-spine-right",
    label: "Lower Spine Right",
  },
  {
    value: "shoulder-left-back",
    label: "Shoulder Left",
  },
  {
    value: "upper-arm-left-back",
    label: "Upper Arm Left",
  },
  {
    value: "elbow-left-back",
    label: "Elbow Left",
  },
  {
    value: "forearm-left-back",
    label: "Forearm Left",
  },
  {
    value: "wrist-left-back",
    label: "Wrist Left",
  },
  {
    value: "hand-left-back",
    label: "Hand Left",
  },
  {
    value: "knee-left-back",
    label: "Knee Left",
  },
  {
    value: "lower-leg-left-back",
    label: "Lower Leg Left",
  },
  {
    value: "ankle-left-back",
    label: "Ankle Left",
  },
  {
    value: "foot-left-back",
    label: "Foot Left",
  },
  {
    value: "buttocks-left-back",
    label: "Buttocks Left",
  },
  {
    value: "middle-back-left",
    label: "Middle Back Left",
  },
  {
    value: "thigh-left-back",
    label: "Thigh Left",
  },
  {
    value: "shoulder-blade-left",
    label: "Shoulder Blade Left",
  },
  {
    value: "neck-left-back",
    label: "Neck Left",
  },
  {
    value: "upper-spine-left",
    label: "Upper Spine Left",
  },
  {
    value: "lower-spine-left",
    label: "Lower Spine Left",
  },
];

const states: SelectOption[] = [
  { value: "0", label: "Variable" },
  { value: "1", label: "Mild" },
  { value: "2", label: "Moderate" },
  { value: "3", label: "Severe" },
];

type AffectedBodyPartsInputProps = {
  bodyParts: BodyPartInput[];
  currentBodyPart: BodyPartExtended | null;
  setScopedCurrentBodyPart: (bp: BodyPartExtended | null) => void;
  handleAddBodyPart: () => void;
  handleRemoveBodyPart: (index: number) => void;
  handleUpdateBodyPart: (index: number, property: keyof BodyPartInput, value: string | SeverityState) => void;
  symptomId: string;
  activeSymptomId?: string;
};

const AffectedBodyPartsInput = ({
  bodyParts,
  currentBodyPart,
  setScopedCurrentBodyPart,
  handleAddBodyPart,
  handleUpdateBodyPart,
  handleRemoveBodyPart,
  symptomId,
  activeSymptomId,
}: AffectedBodyPartsInputProps) => {
  return (
    <div className="affecte-body-parts-container">
      {bodyParts.map((bp, index) => (
        <div className="affected-body-parts-input" key={`${symptomId}-${index}`}>
          <input
            type="radio"
            name={`active-input-${symptomId}`}
            checked={activeSymptomId === symptomId && currentBodyPart?.index === index}
            onChange={() => setScopedCurrentBodyPart({ ...bp, index })}
          />
          <Select<SelectOption>
            className="sides"
            options={sides}
            value={sides.find((s) => s.value === bp.side)}
            onChange={(selectedOption) => {
              if (!selectedOption) return;
              // Keep selection snapshot in sync with new side
              setScopedCurrentBodyPart({ ...bp, side: selectedOption.value, index });
              handleUpdateBodyPart(index, "side", selectedOption.value);
            }}
            onFocus={() => setScopedCurrentBodyPart({ ...bp, index })}
            onMenuOpen={() => setScopedCurrentBodyPart({ ...bp, index })}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          <Select<SelectOption>
            className="body-parts"
            options={bp.side === "front" ? frontSideParts : backSideParts}
            value={(bp.side === "front" ? frontSideParts : backSideParts).find((p) => p.value === bp.key)}
            onChange={(selectedOption) => {
              if (!selectedOption) return;

              // Derive side from chosen key to keep selection on map in sync
              const newKey = selectedOption.value;
              const derivedSide = newKey.includes("-back") ? "back" : "front";

              handleUpdateBodyPart(index, "key", newKey);
              if (bp.side !== derivedSide) handleUpdateBodyPart(index, "side", derivedSide);
            }}
            onFocus={() => setScopedCurrentBodyPart({ ...bp, index })}
            onMenuOpen={() => setScopedCurrentBodyPart({ ...bp, index })}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          <Select<SelectOption>
            className="states"
            options={states}
            value={states.find((s) => s.value === bp.state)}
            onChange={(selectedOption) => {
              if (!selectedOption) return;
              // Keep selection snapshot in sync with new side
              setScopedCurrentBodyPart({ ...bp, state: selectedOption.value as SeverityState, index });
              handleUpdateBodyPart(index, "state", selectedOption.value as SeverityState);
            }}
            onFocus={() => setScopedCurrentBodyPart({ ...bp, index })}
            onMenuOpen={() => setScopedCurrentBodyPart({ ...bp, index })}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          <button type="button" className="remove-button" onClick={() => handleRemoveBodyPart(index)}>
            <FaMinusCircle className="remove-icon" />
          </button>
        </div>
      ))}

      <button type="button" className="add-button" onClick={handleAddBodyPart}>
        + Add Body Part
      </button>
    </div>
  );
};

export default AffectedBodyPartsInput;
