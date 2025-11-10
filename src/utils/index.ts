import type { Side } from "~/types";

export const deriveSideFromKey = (key: string | undefined): Side => (key && key.includes("-back") ? "back" : "front");
