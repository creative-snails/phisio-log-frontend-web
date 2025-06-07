import { useEffect, useState } from "react";

import "./SymptomFormSection.css";

type Symptom = {
  name: string;
  startDate: string;
  affectedParts: string;
  isOpen?: boolean;
};

const SymptomFormSection = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => {
        const records = data["health-records"];
        const Record = records?.[0];
        const loadedSymptoms = (Record.symptoms || []).map((s: Symptom) => ({
          ...s,
          isOpen: true,
        }));
        setSymptoms(loadedSymptoms);
      })
      .catch((error) => {
        console.error("Error loading symptoms: ", error);
      });
  }, []);

  const handleChange = (index: number, field: keyof Symptom, value: string) => {
    const update = [...symptoms];
    (update[index] as any)[field] = value;
    setSymptoms(update);
  };

  const handleUpdate = () => {
    console.log("Updated Symptoms:", symptoms);
    setSuccessMessage("Symptoms successfully updated");
  };

  const isValid = () => {
    return symptoms.every((s) => s.name.trim() && s.startDate.trim());
  };

  const toggleCol = (index: number) => {
    const update = [...symptoms];
    update[index].isOpen = !update[index].isOpen;
    setSymptoms(update);
  };

  const addSymptom = () => {
    setSymptoms([
      ...symptoms,
      { name: "", startDate: "", affectedParts: "Placeholder: affected parts coming soon", isOpen: true },
    ]);
  };

  const removeSymptom = (index: number) => {
    const update = symptoms.filter((_, i) => i !== index);
    setSymptoms(update);
  };

  return (
    <div className="symptom-form-container">
      <h2>Symptoms</h2>
      {symptoms.map((symptom, index) => (
        <div key={index} className="symptom-card">
          <div className="symptom-header" onClick={() => toggleCol(index)}>
            <h4>Symptom {index + 1}</h4>
            <button className="update-button" onClick={handleUpdate} disabled={!isValid()}>
              Update Symptoms
            </button>
          </div>

          {symptom.isOpen && (
            <div className="symptom-body">
              <label>Name</label>
              <input
                type="text"
                value={symptom.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Enter symptom name"
              />

              <label>Start Date</label>
              <input
                type="date"
                value={symptom.startDate}
                onChange={(e) => handleChange(index, "startDate", e.target.value)}
              />

              <label>Affected Parts</label>
              <div className="placeholder">{symptom.affectedParts}</div>
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSymptom(index);
                }}
              >
                {" "}
                Remove{" "}
              </button>
            </div>
          )}
        </div>
      ))}
      <button className="add-button" onClick={addSymptom}>
        {" "}
        + Add Symptom
      </button>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default SymptomFormSection;
