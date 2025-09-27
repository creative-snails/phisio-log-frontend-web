import type { HealthRecord } from "~/types";

/**
 * Get the maximum severity state from all symptoms in a health record
 */
export const getMaxSeverityState = (record: HealthRecord): number => {
  let maxState = 0;

  record.symptoms.forEach((symptom) => {
    if (symptom.affectedParts) {
      symptom.affectedParts.forEach((part) => {
        const state = parseInt(part.state);
        if (state > maxState) {
          maxState = state;
        }
      });
    }
  });

  return maxState;
};

/**
 * Convert severity state to color
 */
export const getSeverityColor = (state: number | string): string => {
  const numericState = typeof state === "string" ? parseInt(state) : state;

  switch (numericState) {
    case 3:
      return "#ffcdd2"; // Pastel red - severe
    case 2:
      return "#e1bee7"; // Pastel purple - moderate
    case 1:
      return "#ffe0b2"; // Pastel orange - mild
    case 0:
      return "#f0f0f0"; // Light gray - variable
    default:
      return "#f8f9fa"; // Light gray - default/no issues
  }
};

/**
 * Map textual severity label to unified color. Returns null if unknown/missing.
 */
export const getSeverityLabelColor = (label?: string | null): string | null => {
  const l = label?.toLowerCase();
  if (l === "severe") return "#ffcdd2"; // Pastel red
  if (l === "moderate") return "#e1bee7"; // Pastel purple
  if (l === "mild") return "#ffe0b2"; // Pastel orange

  return null;
};

/**
 * Map textual severity label to a numeric state (0 when unknown)
 */
export const getSeverityLabelState = (label?: string | null): number => {
  const l = label?.toLowerCase();
  if (l === "severe") return 3;
  if (l === "moderate") return 2;
  if (l === "mild") return 1;

  return 0;
};

/**
 * Get the severity color for a health record based on maximum symptom severity
 */
export const getRecordSeverityColor = (record: HealthRecord): string => {
  const maxState = getMaxSeverityState(record);

  return getSeverityColor(maxState);
};

/**
 * Get severity color for timeline cards (includes default blue for unset records)
 */
export const getTimelineSeverityColor = (record: HealthRecord): string => {
  // Prefer declared record severity to reflect author's assessment
  const labelColor = getSeverityLabelColor(record.status?.severity ?? null);
  if (labelColor) return labelColor;

  // Fallback to computed maximum symptom severity to ensure a color
  const maxState = getMaxSeverityState(record);
  if (maxState > 0) return getSeverityColor(maxState);

  // No affected parts recorded – use timeline default
  return "#e1f5fe"; // Pastel blue - default for timeline
};
