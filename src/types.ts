export interface Symptom {
  name: string;
  startDate: string;
  affectedParts: string;
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
  id?: number;
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
  data: HealthRecord;
  loading: boolean;
  error: string;
}

export interface ChatHistoryType {
  role: "user" | "assistant";
  message: string;
}
