import { useState } from "react";
import Select from "react-select";

import "./AffectedBodyPartsInput.css";

interface SelectOption {
  label: string;
  value: string;
}

const sides: SelectOption[] = [
  { value: "front", label: "Front" },
  { value: "back", label: "Back" },
];

const AffectedBodyPartsInput = () => {
  const [selectedSide, setSelectedSide] = useState<SelectOption>(sides[0]);

  return (
    <div className="affected-body-parts-input">
      <Select<SelectOption>
        options={sides}
        value={selectedSide}
        onChange={(selectedOption) => selectedOption && setSelectedSide(selectedOption)}
      />
      <Select<SelectOption>
        options={sides}
        value={selectedSide}
        onChange={(selectedOption) => selectedOption && setSelectedSide(selectedOption)}
      />
      <Select<SelectOption>
        options={sides}
        value={selectedSide}
        onChange={(selectedOption) => selectedOption && setSelectedSide(selectedOption)}
      />
    </div>
  );
};

export default AffectedBodyPartsInput;
