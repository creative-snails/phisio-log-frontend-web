import { useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import "./BodyMapViewer.css";
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
    initial.reduce(
      (acc, part) => {
        acc[part.key] = part.state;

        return acc;
      },
      {} as { [key: string]: SeverityState }
    )
  );

  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newRotation = rotationDegrees + 180;
    setRotationDegrees(newRotation);
    setActiveDropdown(null);
  };

  const togglePart = (partId: string) => {
    setActiveDropdown((prev) => (prev === partId ? null : partId));
  };

  const handleSeverityChange = (partId: string, severity: SeverityState) => {
    const updated = { ...selectedParts, [partId]: severity };
    setSelectedParts(updated);
    setActiveDropdown(null);
    if (onChange) {
      const partsArray = Object.entries(updated).map(([key, state]) => ({ key, state: state as SeverityState }));
      onChange(partsArray);
    }
  };

  const getPartFill = (part: bodyPartData) => {
    const state = selectedParts[part.id];

    return state ? getSeverityColor(state) : "#f8f9fa";
  };

  const handleTransitionEnd = () => setIsAnimating(false);
  const currentSide = rotationDegrees % 360 >= 180 ? backSide : frontSide;

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
                  onClick={() => togglePart(part.id)}
                  style={{ cursor: "pointer" }}
                />
                {activeDropdown === part.id && (
                  <foreignObject x={part.cx ?? 60} y={part.cy ?? 30} width="120" height="60">
                    <select
                      value={selectedParts[part.id] ?? ""}
                      onChange={(e) => handleSeverityChange(part.id, e.target.value as SeverityState)}
                      style={{
                        width: "100%",
                        fontSize: "14px",
                      }}
                    >
                      <option value="">Select severity</option>
                      {severityOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </foreignObject>
                )}
              </g>
            ))}
          </svg>
        </div>
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
