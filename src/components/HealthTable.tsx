import "./HealthTable.css";
import type { HealthRecord } from "~/types";

const HealthTable = ({ records, onClick }: { records: HealthRecord[]; onClick: (record: HealthRecord) => void }) => {
  return (
    <div className="health-table-container">
      <table className="health-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Symptoms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.description}</td>
              <td>{new Date(record.createdAt).toLocaleDateString()}</td>
              <td>{record.symptoms.map((s) => s.name).join(", ")}</td>
              <td>
                <button className="view-details-btn" onClick={() => onClick(record)} style={{ marginRight: "10px" }}>
                  View Details
                </button>
                <button className="edit-btn" onClick={() => alert("This is only a placeholder")}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthTable;
