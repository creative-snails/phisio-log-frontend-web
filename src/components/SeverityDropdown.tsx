import type { SeverityState } from "~/types";

interface SeverityDropdownProps {
  value: SeverityState | "";
  options: { value: SeverityState; label: string }[];
  position: { x: number; y: number };
  onChange: (val: SeverityState) => void;
}

const SeverityDropdown = ({ value, options, position, onChange }: SeverityDropdownProps) => {
  return (
    <div
      className="dropdown-overlay"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
    >
      <select value={value} onChange={(e) => onChange(e.target.value as SeverityState)} className="severity-dropdown">
        <option value="">Select severity</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeverityDropdown;
