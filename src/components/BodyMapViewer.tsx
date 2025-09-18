import { useEffect, useState } from "react";

import "./BodyMapViewer.css";
import { type bodyPartData, frontSide } from "~/services/bodyParts";
import type { HealthRecord } from "~/types";

interface BodyMapViewerProps {
  className?: string;
  records?: HealthRecord[];
}

const BodyMapViewer = ({ className = "", records = [] }: BodyMapViewerProps) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [affectedParts, setAffectedParts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const parts: { [key: string]: string } = {};
    records.forEach((record) => {
      if (record.status.stage !== "resolved" && record.status.stage !== "closed") {
        record.symptoms.forEach((symptom) => {
          if (symptom.affectedParts) {
            symptom.affectedParts.forEach((part) => {
              const currentState = parts[part.key];
              if (!currentState || parseInt(part.state) > parseInt(currentState)) {
                parts[part.key] = part.state;
              }
            });
          }
        });
      }
    });
    setAffectedParts(parts);
    console.log("Affected parts:", parts);
  }, [records]);

  const handlePartClick = (partId: string) => {
    setSelectedPart(selectedPart === partId ? null : partId);
  };

  const getPartFill = (part: bodyPartData) => {
    if (selectedPart === part.id) return "#ff6b6b";
    if (hoveredPart === part.id) return "#bbdefb";

    // Check if part is affected by current health issues
    const affectedState = affectedParts[part.id];
    if (affectedState) {
      switch (affectedState) {
        case "1":
          return "#c8e6c9"; // Light green - mild
        case "2":
          return "#fff3cd"; // Light yellow - moderate
        case "3":
          return "#ffcdd2"; // Light red - severe
        default:
          return "#f8f9fa";
      }
    }

    return "#f8f9fa"; // Light gray - default
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
          {affectedParts[selectedPart] ? (
            <p>
              Current issue severity:{" "}
              {affectedParts[selectedPart] === "1"
                ? "Mild"
                : affectedParts[selectedPart] === "2"
                  ? "Moderate"
                  : "Severe"}
            </p>
          ) : (
            <p>No current issues reported for this area.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BodyMapViewer;
