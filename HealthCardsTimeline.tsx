import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { HealthRecord, Symptom } from "./src/types";

import "./HealthCardsGrid.css";

const FILTERS = ["All", "Pain", "Allergies", "Injuries"];

interface HealthCardsGridProps {
  records: HealthRecord[];
  onClick: (record: HealthRecord) => void;
}

const BodyMapPanel = ({ symptoms }: { symptoms: HealthRecord["symptoms"] }) => {
  return (
    <div className="body-map-panel">
      {/* Placeholder for body map visualization */}
      <svg width="80" height="160" viewBox="0 0 80 160">
        <ellipse cx="40" cy="40" rx="30" ry="35" fill="#e0e0e0" />
        <rect x="25" y="75" width="30" height="60" rx="15" fill="#e0e0e0" />
        {/* Highlighted symptom areas */}
        {symptoms.map((s: Symptom, idx: number) => (
          <circle key={idx} cx={40 + (idx % 2 === 0 ? -10 : 10)} cy={90 + idx * 10} r="7" fill="#ffb74d" opacity="0.8">
            <title>{s.name}</title>
          </circle>
        ))}
      </svg>
      <div className="body-map-labels">
        {symptoms.length > 0 ? (
          symptoms.map((s: Symptom) => (
            <span key={s.name} className="body-map-symptom">
              {s.name}
            </span>
          ))
        ) : (
          <span className="body-map-none">No symptoms mapped</span>
        )}
      </div>
    </div>
  );
};
function getCategory(record: HealthRecord): string {
  // Example: derive category from record or symptoms
  if (record.symptoms.some((s: Symptom) => s.name.toLowerCase().includes("pain"))) {
    return "Pain";
  }
  if (record.symptoms.some((s: Symptom) => s.name.toLowerCase().includes("allergy"))) {
    return "Allergies";
  }
  if (record.symptoms.some((s: Symptom) => s.name.toLowerCase().includes("injury"))) {
    return "Injuries";
  }

  return "Other";
}

const HealthTimeline = ({ records, onClick }: HealthCardsGridProps) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("All");

  // Filter records by category
  const filteredRecords = filter === "All" ? records : records.filter((r) => getCategory(r) === filter);

  return (
    <div className="timeline-container">
      {/* Filter Bar */}
      <div className="timeline-filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`timeline-filter-pill${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="timeline">
        {filteredRecords
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .map((record, idx) => (
            <div key={record.id} className="timeline-item">
              <div className="timeline-dot" />
              {idx < filteredRecords.length - 1 && <div className="timeline-line" />}
              <div className="timeline-content" onClick={() => onClick(record)}>
                <div className="timeline-header">
                  <h3>{record.description}</h3>
                  <span className="timeline-date">{new Date(record.createdAt!).toLocaleDateString()}</span>
                </div>
                <div className="timeline-details">
                  <BodyMapPanel symptoms={record.symptoms} />
                  <div className="timeline-info">
                    <p>
                      <strong>Symptoms:</strong> {record.symptoms.map((s: Symptom) => s.name).join(", ") || "None"}
                    </p>
                  </div>
                </div>
                <div className="timeline-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/health-record/${record.id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HealthTimeline;
