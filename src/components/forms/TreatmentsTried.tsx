import "./TreatmentsTried.css";

type TreatmentsTriedProps = {
  treatments: string[];
  setTreatments: (treatments: string[]) => void;
};

const TreatmentsTried = ({ treatments, setTreatments }: TreatmentsTriedProps) => {
  const updateTreatments = (index: number, value: string) => {
    const updated = [...treatments];
    updated[index] = value;
    setTreatments(updated);
  };
  const addTreatment = () => setTreatments([...treatments, ""]);
  const removeTreatment = (index: number) => {
    const updated = [...treatments];
    updated.splice(index, 1);
    setTreatments(updated);
  };

  return (
    <div className="treatments-tried-container">
      <h3>Treatments Tried</h3>
      {treatments.map((treatment, i) => (
        <div key={i} className="treatment-item">
          <input type="text" value={treatment} onChange={(e) => updateTreatments(i, e.target.value)} />
          <button type="button" className="remove-button" onClick={() => removeTreatment(i)}>
            X
          </button>
        </div>
      ))}
      <button type="button" className="add-button" onClick={addTreatment}>
        + Add Treatment
      </button>
    </div>
  );
};
export default TreatmentsTried;
