import { useEffect, useState } from "react";
import BodyMapViewer from "./BodyMapViewer";
import HealthModal from "./HealthModal.tsx";

import HealthTimeline from "~/components/HealthTimeline";
import type { HealthRecord } from "~/types";

const HealthRecordsManager = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  const handleNext = () => {
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % records.length : null));
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + records.length) % records.length : null));
  };

  const handleRecordClick = (record: HealthRecord) => {
    const index = records.findIndex((r) => r.id === record.id);
    setSelectedIndex(index);
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
            <HealthTimeline records={records} onClick={handleRecordClick} />
          )}
        </div>
        <div className="body-map-section">
          <h2 className="dashboard-section-title bodymap-title">Body Map</h2>
          <BodyMapViewer records={records} />
        </div>
      </div>

      {selectedIndex !== null && (
        <HealthModal
          record={records[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default HealthRecordsManager;
