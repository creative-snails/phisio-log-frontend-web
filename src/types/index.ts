// Form validation types
export type FormErrors<T> = {
  _errors?: string[];
} & {
  [K in keyof T]?: FormErrors<T[K]>;
};

// Health domain types
export type SeverityState = "0" | "1" | "2" | "3";

export type BodyPart = {
  key: string;
  state: SeverityState;
};

export type BodyPartInput = BodyPart & { side: string };
export type BodyPartExtended = BodyPartInput & { index: number };

export interface Symptom {
  id: string;
  name: string;
  startDate: string;
  affectedParts?: BodyPart[];
}

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
    symptoms: Symptom[];
  };
  loading: boolean;
  error: string;
}

export type Side = "front" | "back";

export type BodyPartSelectionState = {
  symptomId: string | null;
  index: number | null;
  side: Side;
};

// Chat types
export interface ChatHistoryType {
  id?: string;
  history: {
    role: "user" | "assistant";
    message: string;
  }[];
}
