import { useEffect, useState } from "react";
import HealthCardGrid from "./HealthCardsGrid.tsx";
import HealthModal from "./HealthModal.tsx";

import type { HealthRecord } from "~/types/types";

const HealthRecordsManager = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:4444/health-records")
      .then((response) => response.json())
      .then((data) => setRecords(data));
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
      <h2>Health Records</h2>
      <div className="health-records-grid">
        <HealthCardGrid records={records} onClick={handleRecordClick} />
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
