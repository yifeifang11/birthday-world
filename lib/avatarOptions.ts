import type { AvatarConfig } from "./types";

export const skinToneOptions = [
  "#f5d0b5",
  "#e8b38f",
  "#c98d6f",
  "#b56f4d",
  "#8d4d36",
  "#f0e1d6",
];
export const hairColorOptions = [
  "#2b1b12",
  "#473126",
  "#6b4b3a",
  "#94684d",
  "#d7b28f",
  "#7b3f00",
  "#1f2937",
  "#ffffff",
];
export const shirtColorOptions = [
  "#ff7f50",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#ef4444",
];

export const defaultAvatarConfig: AvatarConfig = {
  skinColor: skinToneOptions[0],
  hairColor: hairColorOptions[0],
  shirtColor: shirtColorOptions[5],
  headShape: "round",
  torsoShape: "box",
  hairStyle: "cap",
  eyes: "dots",
  mouth: "smile",
  accessory: "none",
};

export const avatarShapeOptions = {
  headShape: ["round", "tall", "wide"] as const,
  torsoShape: ["box", "oval", "cone"] as const,
  hairStyle: ["bald", "cap", "spiky", "sidePart"] as const,
  eyes: ["dots", "oval", "sleepy"] as const,
  mouth: ["smile", "flat", "open"] as const,
  accessory: ["none", "glasses", "hat", "partyHat"] as const,
};

export function toLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
