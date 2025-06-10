import { IoClose } from "react-icons/io5";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import "./HealthModal.css";
import body from "~/assets/img/body.png";
import type { HealthRecord } from "~/types";

interface HealthModalProps {
  record: HealthRecord;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const HealthModal = ({ record, onClose, onNext, onPrev }: HealthModalProps) => {
  const latestConsultation = record.medicalConsultations[record.medicalConsultations.length - 1];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <IoClose size={30} />
        </button>
        <div className="modal-body">
          <button className="nav-button next" onClick={onNext}>
            <IoChevronBack size={40} />
          </button>
          <div className="health-record-details">
            <h2>{record.description}</h2>
            <div className="details-container">
              <div className="details-text">
                <p>
                  <strong>Date:</strong> {new Date(record.createdAt!).toLocaleDateString()}
                </p>
                <p>
                  <strong>Symptoms:</strong> {record.symptoms.map((s) => s.name).join(", ")}
                </p>
                <div className="detail-separator-line" />
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
            <IoChevronForward size={40} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthModal;
