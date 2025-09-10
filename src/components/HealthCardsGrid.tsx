import { useNavigate } from "react-router-dom";

import "./HealthCardsGrid.css";
import type { HealthRecord } from "~/types";

interface HealthCardsGridProps {
  records: HealthRecord[];
  onClick: (record: HealthRecord) => void;
}

const HealthsCardsGrid = ({ records, onClick }: HealthCardsGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid-container">
      <div className="grid">
        {records.map((record) => (
          <div key={record.id} className="grid-item" onClick={() => onClick(record)}>
            <div className="health-card">
              <h3>{record.description}</h3>
              <div className="card-content">
                <p>
                  <strong>Date:</strong> {new Date(record.createdAt!).toLocaleDateString()}
                </p>
                <p>
                  <strong>Symptoms:</strong> {record.symptoms.map((s) => s.name).join(", ")}
                </p>
              </div>
              <div className="card-actions">
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

export default HealthsCardsGrid;
