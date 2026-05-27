import { z } from "zod";
import { avatarShapeOptions } from "./avatarOptions";

const avatarConfigSchema = z.object({
  skinColor: z.string().min(1),
  hairColor: z.string().min(1),
  shirtColor: z.string().min(1),
  eyeColor: z.string().min(1),
  mouthColor: z.string().min(1),
  headShape: z.enum(avatarShapeOptions.headShape),
  torsoShape: z.enum(avatarShapeOptions.torsoShape),
  hairStyle: z.enum(avatarShapeOptions.hairStyle),
  eyes: z.enum(avatarShapeOptions.eyes),
  mouth: z.enum(avatarShapeOptions.mouth),
  accessory: z.enum(avatarShapeOptions.accessory),
});

export const createMessageSchema = z.object({
  displayName: z.string().trim().min(1).max(32),
  message: z.string().trim().min(1).max(500),
  avatar: avatarConfigSchema,
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export function parseAdminSecret(value: string | null) {
  return (value ?? "").trim();
}

export function getValidatedMessageSubmission(input: unknown) {
  return createMessageSchema.parse(input);
}
