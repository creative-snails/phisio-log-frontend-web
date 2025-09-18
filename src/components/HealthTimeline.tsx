import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./HealthTimeline.css";
import type { HealthRecord, Symptom } from "~/types";

const FILTERS = ["All", "Pain", "Allergies", "Injuries"];

interface HealthTimelineProps {
  records: HealthRecord[];
  onClick: (record: HealthRecord) => void;
}

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

const getSeverityColor = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case "severe":
      return "#ffcdd2"; // Pastel red
    case "moderate":
      return "#ffe0b2"; // Pastel orange
    case "mild":
      return "#c8e6c9"; // Pastel green
    default:
      return "#e1f5fe"; // Pastel blue
  }
};

const HealthTimeline = ({ records, onClick }: HealthTimelineProps) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("All");

  // Filter records by category
  const filteredRecords = filter === "All" ? records : records.filter((r) => getCategory(r) === filter);

  // Group records by month

  const groupedRecords = filteredRecords
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .reduce((groups: { [key: string]: HealthRecord[] }, record) => {
      const date = new Date(record.createdAt!);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(record);

      return groups;
    }, {});

  const groupKeys = Object.keys(groupedRecords);

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
        {groupKeys.map((groupKey, groupIdx) => {
          const groupRecords = groupedRecords[groupKey];
          const firstRecord = groupRecords[0];
          const monthYear = new Date(firstRecord.createdAt!).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });

          return (
            <div key={groupKey} className="timeline-group">
              <div className="timeline-dot" />
              {groupIdx < groupKeys.length - 1 && <div className="timeline-line" />}
              <div className="timeline-group-header">
                <h4>{monthYear}</h4>
              </div>
              <div className="timeline-group-items">
                {groupRecords.map((record) => (
                  <div
                    key={record.id}
                    className="timeline-content"
                    style={{ borderLeftColor: getSeverityColor(record.status.severity) }}
                    onClick={() => onClick(record)}
                  >
                    <div className="timeline-header">
                      <h3>
                        {record.description} with {record.status.severity} symptoms
                      </h3>
                    </div>
                    <div className="timeline-subheader">
                      <div className="timeline-left">
                        <span className="timeline-date">{new Date(record.createdAt!).toLocaleDateString()}</span>
                        <div className="symptom-capsules">
                          {record.symptoms.map((symptom: Symptom, idx: number) => (
                            <span key={idx} className="symptom-capsule">
                              {symptom.name}
                            </span>
                          ))}
                        </div>
                      </div>
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
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthTimeline;
