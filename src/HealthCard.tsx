import React, { useState } from "react";
import type { HealthRecord } from "./types";

import "./HealthCard.css";

export const HealthCard: React.FC<{ record: HealthRecord }> = ({ record }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const latestConsultation = record.medicalConsultations[record.medicalConsultations.length - 1];

  return (
    <li className="health-card">
      {/* High-level information always visible */}
      <div className="health-card-header">
        <h3>{record.description}</h3>
        <span className="date">{new Date(record.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="health-card-summary">
        <p>
          <strong>Symptoms:</strong> {record.symptoms.map((s) => s.name).join(", ")}
        </p>
        <div className="container-button">
          <button onClick={() => setIsExpanded(!isExpanded)} className="details-toggle">
            {isExpanded ? "Show Less" : "Show More"}
          </button>
          <button className="edit-button" onClick={() => alert("This is a placeholder...")}>
            Edit
          </button>
        </div>
      </div>

      {/* Detailed information shown only when expanded */}
      {isExpanded && (
        <div className="health-card-details">
          <div className="details">
            <p>
              <strong>Doctor:</strong> {latestConsultation?.consultant}
            </p>
            <p>
              <strong>Diagnosis:</strong> {latestConsultation?.diagnosis}
            </p>
            <p>
              <strong>Status:</strong> {record.status.stage} - {record.status.severity}
            </p>
            <p>
              <strong>Treatments Tried:</strong> {record.treatmentsTried.join(", ")}
            </p>
            {latestConsultation?.followUpActions && (
              <p>
                <strong>Follow-up Actions:</strong> {latestConsultation.followUpActions.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </li>
  );
};
