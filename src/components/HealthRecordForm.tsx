import { useState } from "react";

interface HealthRecord {
  description: string;
  treatments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HealthRecordForm = () => {
  const [formData, setFormData] = useState<HealthRecord>({
    description: "Mild headache and fatigue over the past few days.",
    treatments: ["Paracetamol", "Rest"],
    createdAt: new Date("2024-05-31T15:00:00Z"),
    updatedAt: new Date(),
  });

  const [newTreatment, setNewTreatment] = useState("");

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      description: e.target.value,
      updatedAt: new Date(),
    }));
  };

  const handleAddTreatment = () => {
    if (!newTreatment.trim()) return;
    setFormData((prev) => ({
      ...prev,
      treatments: [...prev.treatments, newTreatment.trim()],
      updatedAt: new Date(),
    }));
    setNewTreatment("");
  };

  const handleRemoveTreatment = (index: number) => {
    const updated = [...formData.treatments];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      treatments: updated,
      updatedAt: new Date(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted record:", formData);
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
          onChange={handleDescriptionChange}
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
          <button type="button" className="details-toggle" onClick={handleAddTreatment}>
            Add
          </button>
        </div>
        <ul className="treatment-list">
          {formData.treatments.map((treatment, i) => (
            <li key={i}>
              {treatment}
              <button type="button" className="edit-button" onClick={() => handleRemoveTreatment(i)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-group" style={{ fontSize: "0.7rem", color: "#555" }}>
        <p>
          <strong>Created:</strong> {formData.createdAt.toLocaleString()}
        </p>
        <p>
          <strong>Updated:</strong> {formData.updatedAt.toLocaleString()}
        </p>
      </div>

      <button type="submit" className="details-toggle">
        Submit
      </button>
    </form>
  );
};

export default HealthRecordForm;
