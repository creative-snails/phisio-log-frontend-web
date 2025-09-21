import { useEffect, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import "./BodyMapViewer.css";
import { backSide, type bodyPartData, frontSide } from "~/services/bodyParts";
import type { HealthRecord } from "~/types";
import { getSeverityColor, getSeverityLabelColor, getSeverityLabelState } from "~/utils/severityColors";

interface BodyMapViewerProps {
  records?: HealthRecord[];
  readOnly?: boolean;
  /**
   * Choose how to color parts:
   * - 'part' (default): color by each part's max affected state
   * - 'record': color all parts by the record's declared severity label
   */
  colorSource?: "part" | "record";
}

const BodyMapViewer = ({ records = [], readOnly = false, colorSource = "part" }: BodyMapViewerProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [affectedParts, setAffectedParts] = useState<{ [key: string]: string }>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
  }, [records]);

  const handleFlip = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);
    const newRotation = rotationDegrees + 180;
    setRotationDegrees(newRotation);

    // Switch the data at 90° (halfway through 0.6s animation)
    setTimeout(() => {
      setIsFlipped(!isFlipped);
    }, 300); // Half of 600ms

    // End animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const getPartFill = (part: bodyPartData) => {
    if (hoveredPart === part.id) return "#bbdefb";

    // Check if part is affected by current health issues
    const affectedState = affectedParts[part.id];

    if (colorSource === "record") {
      // Use record-level label color, but only on affected parts
      if (records.length === 1) {
        if (affectedState) {
          const rec = records[0];
          const labelColor = getSeverityLabelColor(rec.status?.severity ?? null);
          if (labelColor) return labelColor;
        }
      } else {
        // Multiple records overall view: aggregate by maximum label state across records affecting this part
        let maxLabelState = 0;
        records.forEach((rec) => {
          if (rec.status.stage === "resolved" || rec.status.stage === "closed") return;
          rec.symptoms.forEach((symptom) => {
            symptom.affectedParts?.forEach((p) => {
              if (p.key === part.id) {
                const labelState = getSeverityLabelState(rec.status?.severity ?? null);
                if (labelState > maxLabelState) maxLabelState = labelState;
              }
            });
          });
        });
        if (maxLabelState > 0) return getSeverityColor(maxLabelState);
      }
    } else if (affectedState) {
      // Part-based severity coloring
      return getSeverityColor(affectedState);
    }

    return "#f8f9fa"; // Light gray - default
  };

  const currentSide = isFlipped ? backSide : frontSide;

  return (
    <div className="body-map-viewer">
      <div className="body-map-container">
        <div
          className="body-svg-wrapper"
          style={{
            transform: `rotateY(${rotationDegrees}deg)`,
            transition: isAnimating ? "transform 0.6s ease-in-out" : "none",
          }}
        >
          <svg viewBox="950 400 2800 5400" className="body-svg" xmlns="http://www.w3.org/2000/svg">
            {currentSide.map((part) => (
              <path
                key={part.id}
                d={part.d}
                fill={getPartFill(part)}
                stroke="#333"
                strokeWidth="2"
                className="body-part"
                onMouseEnter={() => !readOnly && setHoveredPart(part.id)}
                onMouseLeave={() => !readOnly && setHoveredPart(null)}
                style={{ cursor: readOnly ? "default" : "pointer" }}
              />
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

export default BodyMapViewer;
