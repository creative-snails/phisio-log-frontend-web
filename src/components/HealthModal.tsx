import "./HealthModal.css";
import body from "~/assets/img/body.png";
import close from "~/assets/img/close.png";
import nextArrow from "~/assets/img/next.png";
import prevArrow from "~/assets/img/prev.png";
import type { HealthRecord } from "~/types";

const HealthModal = ({
  record,
  onClose,
  onNext,
  onPrev,
}: {
  record: HealthRecord;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const latestConsultation = record.medicalConsultations[record.medicalConsultations.length - 1];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <img src={close} alt="Next" width={30} height={30} />
        </button>
        <div className="modal-body">
          <button className="nav-button next" onClick={onNext}>
            <img src={prevArrow} alt="Next" width={120} height={60} />
          </button>
          <div className="health-record-details">
            <h2>{record.description}</h2>
            <div className="details-container">
              <div className="details-text">
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
              <div className="details-img">
                <img src={body} alt="Next" width={90} height={210} /> {/* Placeholder for body map image */}
              </div>
            </div>
          </div>
          <button className="nav-button prev" onClick={onPrev}>
            <img src={nextArrow} alt="Next" width={120} height={60} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthModal;
