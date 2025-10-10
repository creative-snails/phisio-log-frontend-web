import { useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import "~/components/BodyMapViewer.css";
import { backSide, type bodyPartData, frontSide } from "~/services/bodyParts";
import type { BodyPart } from "~/types";
import { getSeverityColor } from "~/utils/severityColors";

interface BodyMapSelectorProps {
  bodyPart: BodyPart;
  setBodyPart: React.Dispatch<React.SetStateAction<BodyPart>>;
}

const BodyMapSelector = ({ bodyPart, setBodyPart }: BodyMapSelectorProps) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

    if (bodyPart.key === part.id) return getSeverityColor(bodyPart.state);

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
                onClick={() => setBodyPart({ key: part.id, state: "2" })}
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
