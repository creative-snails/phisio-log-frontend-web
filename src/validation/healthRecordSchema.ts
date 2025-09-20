import { z } from "zod";

import { MAX_CHAR_LONG, MAX_CHAR_MEDIUM, MAX_CHAR_SHORT, MIN_CHAR_MEDIUM, MIN_CHAR_SHORT } from "~/utils/constants";
import { maxValidationMessage, minValidationMessage } from "~/validation/helpers";

export const Z_Stage = z.enum(["open", "closed", "in-progress"]);
export const Z_Severity = z.enum(["mild", "moderate", "severe", "variable"]);
export const Z_Progression = z.enum(["improving", "stable", "worsening", "variable"]);

const Z_LabeledEnumOption = <T extends z.ZodTypeAny>(enumSchema: T) =>
  z.object({
    label: z.string(),
    value: enumSchema,
  });

export const Z_StatusOptions = z.object({
  stage: z.array(Z_LabeledEnumOption(Z_Stage)),
  severity: z.array(Z_LabeledEnumOption(Z_Severity)),
  progression: z.array(Z_LabeledEnumOption(Z_Progression)),
});

export const Z_Status = z.object({
  stage: Z_Stage,
  severity: Z_Severity,
  progression: Z_Progression,
});

export const Z_Description = z
  .string()
  .min(MIN_CHAR_MEDIUM, minValidationMessage("Description", MIN_CHAR_MEDIUM))
  .max(MAX_CHAR_LONG, maxValidationMessage("Description", MAX_CHAR_LONG));

export const Z_Symptom = z.object({
  name: z
    .string()
    .trim()
    .min(MIN_CHAR_SHORT, minValidationMessage("Symptom", MIN_CHAR_SHORT))
    .max(MAX_CHAR_SHORT, maxValidationMessage("Symptom", MAX_CHAR_SHORT)),
  startDate: z
    .preprocess((val) => {
      if (val instanceof Date) return val;
      if (typeof val === "string" && val.trim() !== "") {
        const parsed = new Date(val);

        return isNaN(parsed.getTime()) ? undefined : parsed;
      }

      return undefined;
    }, z.date().optional())
    .refine((d) => !!d, { message: "Start date is required" })
    .refine((d) => !d || d <= new Date(), { message: "Start Date cannot be in the future" }),
});

export const Z_MedicalConsultation = z.object({
  consultant: z
    .string()
    .trim()
    .min(MIN_CHAR_SHORT, minValidationMessage("Consultant", MIN_CHAR_SHORT))
    .max(MAX_CHAR_SHORT, maxValidationMessage("Consultant", MAX_CHAR_SHORT)),
  date: z
    .preprocess((val) => {
      if (val instanceof Date) return val;
      if (typeof val === "string" && val.trim() !== "") {
        const parsed = new Date(val);

        return isNaN(parsed.getTime()) ? undefined : parsed;
      }

      return undefined;
    }, z.date().optional())
    .refine((d) => !!d, { message: "Consultation date is required" })
    .refine((d) => !d || d <= new Date(), { message: "Consultation date cannot be in the future" }),
  diagnosis: z
    .string()
    .trim()
    .min(MIN_CHAR_SHORT, minValidationMessage("Diagnosis", MIN_CHAR_SHORT))
    .max(MAX_CHAR_SHORT, maxValidationMessage("Diagnosis", MAX_CHAR_SHORT)),
  followUpActions: z
    .array(
      z
        .string()
        .trim()
        .min(MIN_CHAR_SHORT, minValidationMessage("Follow-up actions", MIN_CHAR_SHORT))
        .max(MAX_CHAR_MEDIUM, maxValidationMessage("Follow-up actions", MAX_CHAR_MEDIUM))
    )
    .optional()
    .default([]),
});

export const Z_HealthRecordUpdate = z.object({
  description: Z_Description.optional(),
  symptoms: z.array(Z_Symptom).optional(),
  status: z
    .object({
      stage: Z_Stage.optional(),
      severity: Z_Severity.optional(),
      progression: Z_Progression.optional(),
    })
    .optional(),
  treatmentsTried: z
    .array(
      z
        .string()
        .trim()
        .min(MIN_CHAR_SHORT, minValidationMessage("Treatments tried", MIN_CHAR_SHORT))
        .max(MAX_CHAR_SHORT, maxValidationMessage("Treatments tried", MAX_CHAR_SHORT))
    )
    .optional()
    .default([]),
  medicalConsultations: z.array(Z_MedicalConsultation).optional(),
});

export const Z_HealthRecord = z.object({
  description: Z_Description,
  symptoms: z.array(Z_Symptom).min(1, "At least one symptom is required"),
  status: z.object({
    stage: Z_Stage,
    severity: Z_Severity,
    progression: Z_Progression,
  }),
  treatmentsTried: z
    .array(
      z
        .string()
        .trim()
        .min(MIN_CHAR_SHORT, minValidationMessage("Treatments tried", MIN_CHAR_SHORT))
        .max(MAX_CHAR_SHORT, maxValidationMessage("Treatments tried", MAX_CHAR_SHORT))
    )
    .min(1, "At least one treatment is required")
    .default([]),
  medicalConsultations: z.array(Z_MedicalConsultation).min(1, "At least one consultation is required"),
  updates: z.array(Z_HealthRecordUpdate).optional(),
});

export const Z_SymptomsArray = z.array(Z_Symptom);
export const Z_MedicalConsultationArray = z.array(Z_MedicalConsultation);

export type Stage = z.infer<typeof Z_Stage>;
export type Severity = z.infer<typeof Z_Severity>;
export type Progression = z.infer<typeof Z_Progression>;
export type StatusOptionsType = z.infer<typeof Z_StatusOptions>;
export type Status = z.infer<typeof Z_Status>;
export type Description = z.infer<typeof Z_Description>;
export type Symptom = z.infer<typeof Z_Symptom>;
export type MedicalConsultation = z.infer<typeof Z_MedicalConsultation>;
export type HealthRecordUpdateType = z.infer<typeof Z_HealthRecordUpdate>;
export type HealthRecordType = z.infer<typeof Z_HealthRecord>;
