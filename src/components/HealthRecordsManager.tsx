import { useEffect, useState } from "react";
import BodyMapViewer from "./BodyMapViewer";

import HealthTimeline from "~/components/HealthTimeline";
import type { HealthRecord } from "~/types";

const HealthRecordsManager = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isBodyMapOverlayOpen, setIsBodyMapOverlayOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4444/health-records")
      .then((response) => response.json())
      .then((data) => {
        // if you want to test empty state comment line below
        setRecords(data);

        // and use this one:
        //setRecords([]);
      });
  }, []);

  const handleRecordSelect = (record: HealthRecord | null) => {
    setSelectedRecord(record);
  };

  return (
    <div className="home">
      <div className="health-dashboard">
        <div className="timeline-section">
          <h2 className="dashboard-section-title timeline-title">Health Timeline</h2>
          {records.length === 0 ? (
            <div className="empty-state">
              <p>No health records available.</p>
              <p>Create your first health record to start tracking your health journey.</p>
            </div>
          ) : (
            <HealthTimeline records={records} onRecordSelect={handleRecordSelect} />
          )}
        </div>
        <div className="body-map-section">
          <h2 className="dashboard-section-title bodymap-title">Body Map</h2>
          <BodyMapViewer records={selectedRecord ? [selectedRecord] : records} readOnly={true} colorSource="record" />
        </div>
      </div>

      {/* Body Map Toggle Tab */}
      <button className="body-map-tab" onClick={() => setIsBodyMapOverlayOpen(true)} title="View Body Map">
        <span>Body Map</span>
      </button>

      {/* Body Map Slide Panel */}
      <div className={`body-map-panel ${isBodyMapOverlayOpen ? "open" : ""}`}>
        <div className="body-map-panel-header">
          <h3>Body Map</h3>
          <button className="close-panel" onClick={() => setIsBodyMapOverlayOpen(false)} title="Close">
            ×
          </button>
        </div>
        <div className="body-map-panel-content">
          <BodyMapViewer records={selectedRecord ? [selectedRecord] : records} readOnly={true} colorSource="record" />
        </div>
      </div>

      {/* Backdrop when panel is open */}
      {isBodyMapOverlayOpen && <div className="body-map-backdrop" onClick={() => setIsBodyMapOverlayOpen(false)} />}
    </div>
  );
};

export default HealthRecordsManager;
