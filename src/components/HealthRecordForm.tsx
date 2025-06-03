import { useState } from "react";
interface HealthRecordFormProps {
  description: string;
  treatments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HealthRecordForm = ({ description, treatments, createdAt, updatedAt }: HealthRecordFormProps) => {
  const [formData, setFormData] = useState({
    description,
    treatments,
  });

  const [newTreatment, setNewTreatment] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddOrUpdateTreatment = () => {
    const trimmed = newTreatment.trim();
    if (!trimmed) return;

    setFormData((prev) => {
      const updatedTreatments = [...prev.treatments];

      if (editIndex !== null) {
        updatedTreatments[editIndex] = trimmed;
      } else {
        updatedTreatments.push(trimmed);
      }
      return {
        ...prev,
        treatments: updatedTreatments,
      };
    });

    setNewTreatment("");
    setEditIndex(null);
  };

  const handleEditTreatment = (index: number) => {
    setEditIndex(index);
    setNewTreatment(formData.treatments[index]);
  };

  const handleRemoveTreatment = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.treatments];
      updated.splice(index, 1);
      return {
        ...prev,
        treatments: updated,
      };
    });

    if (editIndex === index) {
      setEditIndex(null);
      setNewTreatment("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted record:", {
      ...formData,
      createdAt,
      updatedAt: new Date(),
    });
  };

  return (
    <form className="form-wrapper" onSubmit={handleSubmit}>
      <h2>Add / Edit Health Record</h2>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe symptoms, context, or notes..."
        />
      </div>
      <div className="form-group">
        <label>Treatments Tried</label>
        <div className="treatment-input">
          <input
            type="text"
            value={newTreatment}
            onChange={(e) => setNewTreatment(e.target.value)}
            placeholder="Enter a treatment"
          />
          <button type="button" className="details-toggle" onClick={handleAddOrUpdateTreatment}>
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>
        <ul className="treatment-list">
          {formData.treatments.map((treatment, i) => (
            <li key={i}>
              {treatment}
              <div>
                <button type="button" className="details-toggle" onClick={() => handleEditTreatment(i)}>
                  Edit
                </button>
                <button type="button" className="edit-button" onClick={() => handleRemoveTreatment(i)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group" style={{ fontSize: "0.7rem", color: "#555" }}>
        <p>
          <strong>Created:</strong> {createdAt.toLocaleString()}
        </p>
        <p>
          <strong>Updated:</strong> {updatedAt.toLocaleString()}
        </p>
      </div>
      <button type="submit" className="details-toggle">
        Submit
      </button>
    </form>
  );
};

export default HealthRecordForm;
