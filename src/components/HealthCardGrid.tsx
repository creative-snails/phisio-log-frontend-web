import "./HealthCardGrid.css";
import type { HealthRecord } from "~/types";

interface HealthCardGridProps {
  records: HealthRecord[];
  onClick: (record: HealthRecord) => void;
}

const HealthCard = ({ records, onClick }: HealthCardGridProps) => {
  return (
    <div className="grid-container">
      <div className="grid">
        {records.map((record) => (
          <div key={record.id} className="grid-item" onClick={() => onClick(record)}>
            <div className="health-card">
              <h3>{record.description}</h3>
              <div className="card-content">
                <p>
                  <strong>Date:</strong> {new Date(record.createdAt).toLocaleDateString()}
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
                    alert("This is only a placeholder");
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

export default HealthCard;
