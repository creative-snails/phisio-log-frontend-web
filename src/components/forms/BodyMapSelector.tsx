import { useEffect, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import "~/components/BodyMapViewer.css";
import { backSide, type bodyPartData, frontSide } from "~/services/bodyParts";
import type { BodyPartExtended, Symptom } from "~/types";
import { getSeverityColor } from "~/utils/severityColors";

interface BodyMapSelectorProps {
  currentSymptom: Symptom | null;
  currentBodyPart: BodyPartExtended | null;
  setCurrentBodyPart: React.Dispatch<React.SetStateAction<BodyPartExtended | null>>;
}

const BodyMapSelector = ({ currentSymptom, currentBodyPart, setCurrentBodyPart }: BodyMapSelectorProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [side, setSide] = useState("front");
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);
    const newRotation = rotationDegrees + 180;
    setRotationDegrees(newRotation);

    const newSide = side === "front" ? "back" : "front";
    setSide(newSide);

    // Switch the data at 90° (halfway through 0.6s animation)
    setTimeout(() => setIsFlipped(!isFlipped), 300); // Half of 600ms

    // End animation state
    setTimeout(() => setIsAnimating(false), 600);
  };

  // When the active symptom changes, reset UI. If no selection, prefer front.
  useEffect(() => {
    setHoveredPart(null);
    if (!currentBodyPart) {
      // Only fore to front if there's no active selection
      if (side !== "front" && !isAnimating) handleFlip();
    }
  }, [currentSymptom?.id]);

  // Keep the displayed side in sync with the selected body part
  useEffect(() => {
    if (!currentBodyPart) return;
    if (currentBodyPart.side !== side && !isAnimating) handleFlip();
    setHoveredPart(null);
  }, [currentBodyPart?.side, side, isAnimating]);

  const getPartFill = (part: bodyPartData) => {
    if (hoveredPart === part.id) return "#bbdefb";

    // Highlight the currently selected body part even if it's not yet in affectedParts
    if (currentBodyPart?.key === part.id) {
      const state = currentBodyPart?.state;

      return getSeverityColor(state);
    }

    if (currentSymptom?.affectedParts) {
      for (const p of currentSymptom.affectedParts) {
        if (p.key === part.id && p.state) return getSeverityColor(p.state);
      }
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
                onClick={() => currentBodyPart && setCurrentBodyPart({ ...currentBodyPart, key: part.id, side })}
                onMouseEnter={() => setHoveredPart(part.id)}
                onMouseLeave={() => setHoveredPart(null)}
                style={{ cursor: "pointer" }}
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

export default BodyMapSelector;
