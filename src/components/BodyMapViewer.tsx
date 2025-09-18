import { useState } from "react";

import "./BodyMapViewer.css";
import { type bodyPartData, frontSide } from "~/services/bodyParts";

interface BodyMapViewerProps {
  className?: string;
}

const BodyMapViewer = ({ className = "" }: BodyMapViewerProps) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handlePartClick = (partId: string) => {
    setSelectedPart(selectedPart === partId ? null : partId);
  };

  const getPartFill = (part: bodyPartData) => {
    if (selectedPart === part.id) return "#ff6b6b";
    if (hoveredPart === part.id) return "#bbdefb";

    // Status-based coloring
    switch (part.status) {
      case 1:
        return "#e3f2fd"; // Light green - healthy
      case 2:
        return "#fff3cd"; // Light yellow - mild concern
      case 3:
        return "#f8d7da"; // Light red - needs attention
      default:
        return "#f8f9fa"; // Light gray - default
    }
  };

  return (
    <div className={`body-map-viewer ${className}`}>
      <div className="body-map-container">
        <svg viewBox="950 400 2800 5600" className="body-svg" xmlns="http://www.w3.org/2000/svg">
          {frontSide.map((part) => (
            <path
              key={part.id}
              d={part.d}
              fill={getPartFill(part)}
              stroke="#333"
              strokeWidth="2"
              className="body-part"
              onClick={() => handlePartClick(part.id)}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </svg>
      </div>

      {selectedPart && (
        <div className="selected-part-info">
          <h4>Selected: {selectedPart.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</h4>
          <p>Click to log symptoms or view history for this body part.</p>
        </div>
      )}
    </div>
  );
};

export default BodyMapViewer;
