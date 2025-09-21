export interface Symptom {
  name: string;
  startDate: string;
  affectedParts?: {
    key: string;
    state: "1" | "2" | "3";
  }[];
}

export type SymptomUI = Symptom & {
  isOpen?: boolean;
};

export interface Status {
  stage: string;
  severity: string;
  progression: string;
}

interface MedicalConsultation {
  consultant: string;
  date: string;
  diagnosis: string;
  followUpActions: string[];
}

interface Update {
  description: string;
  symptoms: Symptom[];
  stage: string;
  treatmentsTried: string[];
  progression: string;
  medicalConsultations: MedicalConsultation[];
}

export interface HealthRecord {
  id?: string;
  user?: string;
  title?: string;
  description: string;
  symptoms: Symptom[];
  status: Status;
  treatmentsTried: string[];
  medicalConsultations: MedicalConsultation[];
  updates?: Update[];
  createdAt?: string;
  updatedAt?: string;
}
export interface RecordFormData {
  data: Omit<HealthRecord, "symptoms"> & {
    symptoms: SymptomUI[];
  };
  loading: boolean;
  error: string;
}

export interface ChatHistoryType {
  id?: string;
  history: {
    role: "user" | "assistant";
    message: string;
  }[];
}
