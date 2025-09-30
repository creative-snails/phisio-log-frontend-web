import type { SeverityState } from "~/types";
import type { StatusOptionsType } from "~/validation/healthRecordSchema";

export const ROUTES = {
  EDIT: {
    DESCRIPTION: "edit/EditDescription",
    SYMPTOMS: "edit/EditSymptoms",
    STATUS: "edit/EditStatus",
    TREATMENTS: "edit/EditTreatments",
    CONSULTATIONS: "edit/EditConsultations",
  },
  HEALTH_RECORD: "HealthRecord",
  BODY_MAP: "BodyMap",
  BODY_PART: "BodyPart",
  HOME: "",
} as const;

export const SCREEN_LABELS = {
  BODY_MAP: "Body Map",
  HEALTH_RECORD: "Health Record",
  EDIT: {
    DESCRIPTION: "Edit Description",
    SYMPTOMS: "Edit Symptoms",
    STATUS: "Edit Status",
    TREATMENTS: "Edit Treatments",
    CONSULTATIONS: "Edit Medical Consultations",
  },
} as const;

export const statusOptions: StatusOptionsType = {
  stage: [
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
    { label: "In Progress", value: "in-progress" },
  ],
  severity: [
    { label: "Mild", value: "mild" },
    { label: "Moderate", value: "moderate" },
    { label: "Severe", value: "severe" },
    { label: "Variable", value: "variable" },
  ],
  progression: [
    { label: "Improving", value: "improving" },
    { label: "Stable", value: "stable" },
    { label: "Worsening", value: "worsening" },
    { label: "Variable", value: "variable" },
  ],
} as const;

export const statusConfigs = [
  { field: "stage", title: "Stage", zIndex: 3000, zIndexInverse: 1000 },
  { field: "severity", title: "Severity", zIndex: 2000, zIndexInverse: 2000 },
  { field: "progression", title: "Progression", zIndex: 1000, zIndexInverse: 3000 },
] as const;

export const SEVERITY_OPTIONS: { value: SeverityState; label: string }[] = [
  { value: "0", label: "Variable" },
  { value: "1", label: "Mild" },
  { value: "2", label: "Moderate" },
  { value: "3", label: "Severe" },
];

export const MAX_CHAR_SHORT = 100;
export const MAX_CHAR_MEDIUM = 1000;
export const MAX_CHAR_LONG = 10_000;
export const MIN_CHAR_SHORT = 2;
export const MIN_CHAR_MEDIUM = 10;
export const MIN_CHAR_LONG = 50;
