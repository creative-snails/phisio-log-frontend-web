import type { BodyPart } from "~/types";

export type Side = "front" | "back";

export type Selection = { symptomId: string | null; index: number | null; side: Side };

export type SelectionAction =
  | { type: "SELECT_CARD"; symptomId: string | null; parts: BodyPart[] }
  | { type: "SELECT_PART"; index: number | null; side?: Side }
  | { type: "SET_SIDE"; side: Side };

export const deriveSideFromKey = (key: string | undefined): Side => (key && key.includes("-back") ? "back" : "front");

export const selectionReducer = (state: Selection, action: SelectionAction): Selection => {
  switch (action.type) {
    case "SELECT_CARD": {
      const parts = action.parts || [];
      const hasParts = parts.length > 0;
      const index = hasParts ? parts.length - 1 : null;
      const side = hasParts ? deriveSideFromKey(parts[parts.length - 1]?.key) : "front";

      return { symptomId: action.symptomId, index, side };
    }
    case "SELECT_PART": {
      if (action.index == null) return { ...state, index: null };
      const nextSide = action.side ?? state.side;

      return { ...state, index: action.index, side: nextSide };
    }
    case "SET_SIDE": {
      return { ...state, side: action.side };
    }
    default:
      return state;
  }
};
