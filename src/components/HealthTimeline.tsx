import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./HealthTimeline.css";
import type { HealthRecord, Symptom } from "~/types";

const FILTERS = ["All", "Pain", "Allergies", "Injuries"];

interface HealthTimelineProps {
  records: HealthRecord[];
  onRecordSelect: (record: HealthRecord | null) => void;
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

const HealthTimeline = ({ records, onRecordSelect }: HealthTimelineProps) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("All");
  const [expandedRecordId, setExpandedRecordId] = useState<number | null>(null);

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
                    className={`timeline-content ${expandedRecordId === record.id ? "expanded" : ""}`}
                    style={{ borderLeftColor: getSeverityColor(record.status.severity) }}
                    onClick={() => {
                      if (!record.id) return;
                      const isExpanding = expandedRecordId !== record.id;
                      setExpandedRecordId(isExpanding ? record.id : null);
                      onRecordSelect(isExpanding ? record : null);
                    }}
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

                    {/* Expanded Details */}
                    {expandedRecordId === record.id && (
                      <div className="timeline-expanded-content">
                        <div className="expanded-details">
                          <div className="detail-section">
                            <h4>Latest Medical Consultation</h4>
                            {record.medicalConsultations.length > 0 ? (
                              (() => {
                                const latestConsultation =
                                  record.medicalConsultations[record.medicalConsultations.length - 1];

                                return (
                                  <div className="consultation-summary">
                                    <p>
                                      <strong>Doctor:</strong> {latestConsultation.consultant}
                                    </p>
                                    <p>
                                      <strong>Date:</strong> {new Date(latestConsultation.date).toLocaleDateString()}
                                    </p>
                                    <p>
                                      <strong>Diagnosis:</strong> {latestConsultation.diagnosis}
                                    </p>
                                    {latestConsultation.followUpActions.length > 0 && (
                                      <div className="follow-up-section">
                                        <p>
                                          <strong>Follow-up Actions:</strong>
                                        </p>
                                        <div className="follow-up-grid">
                                          {latestConsultation.followUpActions.map((action, actionIdx) => (
                                            <div key={actionIdx} className="follow-up-item">
                                              <span className="follow-up-bullet">•</span>
                                              <span className="follow-up-text">{action}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()
                            ) : (
                              <p className="no-data">No consultations recorded</p>
                            )}
                          </div>

                          <div className="detail-section">
                            <h4>Health Status</h4>
                            <div className="status-info">
                              <p>
                                <strong>Stage:</strong> {record.status.stage}
                              </p>
                              <p>
                                <strong>Severity:</strong> {record.status.severity}
                              </p>
                              <p>
                                <strong>Progression:</strong> {record.status.progression}
                              </p>
                            </div>

                            <div className="treatments-section">
                              <h4>Treatments</h4>
                              {record.treatmentsTried.length > 0 ? (
                                <div className="treatments-grid">
                                  {record.treatmentsTried.map((treatment, idx) => (
                                    <div key={idx} className="treatment-item">
                                      <span className="treatment-bullet">•</span>
                                      <span className="treatment-text">{treatment}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="no-data">No treatments recorded</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
