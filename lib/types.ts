export type AvatarConfig = {
  skinColor: string;
  hairColor: string;
  shirtColor: string;
  headShape: "round" | "tall" | "wide";
  torsoShape: "box" | "oval" | "cone";
  hairStyle: "bald" | "cap" | "spiky" | "sidePart";
  eyes: "dots" | "oval" | "sleepy";
  mouth: "smile" | "flat" | "open";
  accessory: "none" | "glasses" | "hat" | "partyHat";
};

export type MessageRow = {
  id: string;
  display_name: string;
  name_slug: string;
  message: string;
  avatar: AvatarConfig;
  position_x: number | null;
  position_y: number | null;
  position_z: number | null;
  approved: boolean;
  created_at: string;
};

export type PublicMessage = {
  id: string;
  displayName: string;
  nameSlug: string;
  message: string;
  avatar: AvatarConfig;
  position: { x: number; y: number; z: number };
  approved: boolean;
  createdAt: string;
};

export type MemorySiteType = "voice" | "photo" | "video" | "note";

export type MemorySite = {
  id: string;
  title: string;
  description?: string | null;
  type: MemorySiteType;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  noteText?: string | null;
  position: { x: number; y: number; z: number };
  rotationY?: number;
  enabled: boolean;
};

export type WorldInteractable =
  | {
      id: string;
      kind: "message";
      position: { x: number; y: number; z: number };
      interactionRadius: number;
      prompt: string;
      payload: PublicMessage;
    }
  | {
      id: string;
      kind: "memorySite";
      position: { x: number; y: number; z: number };
      interactionRadius: number;
      prompt: string;
      payload: MemorySite;
    };

export type MessageSubmission = {
  displayName: string;
  message: string;
  avatar: AvatarConfig;
};
