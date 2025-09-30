import { useEffect, useMemo, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import "./BodyMapViewer.css";
import "./InteractiveBodyMap.css";
import { backSide, type bodyPartData, frontSide } from "~/services/bodyParts";
import type { SeverityState } from "~/types";
import { getSeverityColor } from "~/utils/severityColors";

interface InteractiveBodyMapProps {
  initial?: { key: string; state: SeverityState }[];
  onChange: (parts: { key: string; state: SeverityState }[]) => void;
}

const severityOptions: { value: SeverityState; label: string }[] = [
  { value: "0", label: "Variable" },
  { value: "1", label: "Mild" },
  { value: "2", label: "Moderate" },
  { value: "3", label: "Severe" },
];

const InteractiveBodyMap = ({ initial = [], onChange }: InteractiveBodyMapProps) => {
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: SeverityState }>(() =>
    initial.reduce((acc, part) => ({ ...acc, [part.key]: part.state }), {})
  );
  const [hoverPart, setHoverPart] = useState<string | null>(null);

  useEffect(() => {
    const partsArray = Object.entries(selectedParts).map(([key, state]) => ({ key, state }));
    const isEqual =
      partsArray.length === (initial?.length ?? 0) &&
      partsArray.every((p, i) => p.key === initial[i]?.key && p.state === initial[i]?.state);
    if (!isEqual) {
      onChange(partsArray);
    }
  }, [selectedParts, onChange, initial]);

  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null);
  const ensurePartSelected = (partId: string) => {
    setSelectedParts((prev) => ({ ...prev, [partId]: prev[partId] ?? "0" }));
  };

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setRotationDegrees((deg) => deg + 180);
      setActiveDropdown(null);
      setDropdownPosition(null);
    }
  };

  const handleSeverityChange = (partId: string, severity: SeverityState) => {
    setSelectedParts((prev) => ({ ...prev, [partId]: severity }));
    setActiveDropdown(null);
  };

  const getPartFill = (part: bodyPartData) =>
    hoverPart === part.id && !selectedParts[part.id] ? "#b3e5fc" : getSeverityColor(selectedParts[part.id] ?? "");

  const handleTransitionEnd = () => setIsAnimating(false);
  const currentSide = useMemo(() => (rotationDegrees % 360 >= 180 ? backSide : frontSide), [rotationDegrees]);

  const handlePartClick = (partId: string, event: React.MouseEvent<SVGPathElement>) => {
    ensurePartSelected(partId);
    const container = (event.currentTarget.ownerSVGElement?.parentNode as HTMLElement)?.getBoundingClientRect();
    if (container) {
      setDropdownPosition({
        x: event.clientX - container.left,
        y: event.clientY - container.top,
      });
    }
    setActiveDropdown((prev) => (prev === partId ? null : partId));
  };

  return (
    <div className="body-map-viewer">
      <div className="body-map-container">
        <div
          className="body-svg-wrapper"
          style={{
            transform: `rotateY(${rotationDegrees}deg)`,
            transition: isAnimating ? "transform 0.6s ease-in-out" : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <svg viewBox="950 400 2800 5400" className="body-svg" xmlns="http://www.w3.org/2000/svg">
            {currentSide.map((part) => (
              <g key={part.id}>
                <path
                  d={part.d}
                  fill={getPartFill(part)}
                  stroke={selectedParts[part.id] ? getSeverityColor(selectedParts[part.id]) : "#333"}
                  strokeWidth={selectedParts[part.id] ? "3" : "2"}
                  className="body-part"
                  onClick={(e) => handlePartClick(part.id, e)}
                  onMouseEnter={() => setHoverPart(part.id)}
                  onMouseLeave={() => setHoverPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.2s ease" }}
                />
              </g>
            ))}
          </svg>
        </div>
        {activeDropdown && dropdownPosition && (
          <div
            className="dropdown-overlay"
            style={{
              position: "absolute",
              left: `${dropdownPosition.x}px`,
              top: `${dropdownPosition.y}px`,
              zIndex: 10,
            }}
          >
            <select
              value={selectedParts[activeDropdown] ?? ""}
              onChange={(e) => handleSeverityChange(activeDropdown, e.target.value as SeverityState)}
              className="severity-dropdown"
            >
              <option value="">Select severity</option>
              {severityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flip-controls">
        <div
          className={`flip-icon ${isAnimating ? "rotating" : ""}`}
          onClick={handleFlip}
          title="Flip to other side"
          style={{
            transform: `rotate(${rotationDegrees}deg)`,
            transition: isAnimating ? "transform 0.6s ease-in-out" : "transform 0.2s ease",
          }}
        >
          <LuRefreshCw />
        </div>
      </div>
    </div>
  );
};

export default InteractiveBodyMap;
