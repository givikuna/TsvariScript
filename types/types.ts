// types/types.ts

// ---- Class Modifiers ----
export type PropertyVisibility = "pub" | "priv";

export type PropertyKind =
  | "field"
  | "method"
  | "constructor";

// ---- Literals ----
export type LiteralKind = "string" | "number" | "boolean";
