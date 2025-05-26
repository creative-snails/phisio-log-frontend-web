import React, { useEffect, useState } from "react";
import { HealthCard } from "./HealthCard";
import type { HealthRecord } from "./types";

const Home: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    fetch("../db.json")
      .then((response) => response.json())
      .then((data) => setRecords(data["health-records"]));
  }, []);

  return (
    <div className="home">
      <h2>Health Records</h2>
      <ul className="health-records-list">
        {records.map((record) => (
          <HealthCard key={record.id} record={record} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
