import { useEffect, useState } from "react";
import HealthCardGrid from "./HealthCardsGrid.tsx";
import HealthModal from "./HealthModal.tsx";

import { getHealthRecords } from "~/services/api/healthRecordsApi.ts";
import type { HealthRecord } from "~/types";

const HealthRecordsManager = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const healthRecords = await getHealthRecords();
        setRecords(healthRecords);
      } catch (error) {
        console.error("HealthRecordsManager: Error fetching health records!", error);
      }
    };
    fetchHealthRecords();
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
        {records.length === 0 ? (
          <div className="empty-state">
            <p>No health records available.</p>
            <p>This is a placeholder with instruction to create your first health record.</p>
          </div>
        ) : (
          <HealthCardGrid records={records} onClick={handleRecordClick} />
        )}
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
