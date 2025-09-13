import type {
  Description,
  MedicalConsultation,
  Progression,
  Severity,
  Stage,
  Symptom,
} from "~/validation/healthRecordSchema";
import { Z_Description, Z_MedicalConsultationArray, Z_Status, Z_SymptomsArray } from "~/validation/healthRecordSchema";

export const validators = {
  description: (description: Description) => {
    const result = Z_Description.safeParse(description);

    return {
      valid: result.success,
      message: result.success ? "" : result.error.issues.map((e) => e.message).join(", "),
    };
  },

  symptoms: (symptoms: Symptom[]) => {
    const normalized = symptoms.map((s) => ({
      ...s,
      startDate: typeof s.startDate === "string" ? new Date(s.startDate) : s.startDate,
    }));
    const result = Z_SymptomsArray.safeParse(normalized);

    return {
      valid: result.success,
      message: result.success ? "" : result.error.issues.map((e) => e.message).join(", "),
    };
  },

  treatmentsTried: (treatments: string[]) => ({
    valid: treatments && treatments.every((treatment) => treatment.trim().length >= 3),
    message: "Each treatment must be at least 3 characters long!",
  }),

  status: (status: { stage: Stage; severity: Severity; progression: Progression }) => {
    const result = Z_Status.safeParse(status);

    return {
      valid: result.success,
      message: result.success ? "" : result.error.issues.map((e) => e.message).join(", "),
    };
  },

  medicalConsultations: (consultations: MedicalConsultation[]) => {
    const normalized = consultations.map((c) => ({
      ...c,
      date: typeof c.date === "string" ? new Date(c.date) : c.date,
    }));

    const result = Z_MedicalConsultationArray.safeParse(normalized);

    return {
      valid: result.success,
      message: result.success ? "" : result.error.issues.map((e) => e.message).join(", "),
    };
  },
};
