import * as THREE from "three";
import type { MemorySite, PublicMessage, WorldInteractable } from "./types";

export function buildWorldInteractables(
  messages: PublicMessage[],
  memorySites: MemorySite[],
): WorldInteractable[] {
  const messageInteractables = messages.map((message) => ({
    id: message.id,
    kind: "message" as const,
    position: message.position,
    interactionRadius: 2.2,
    prompt: "Press E to read message",
    payload: message,
  }));

  const memoryInteractables = memorySites
    .filter((site) => site.enabled)
    .map((site) => ({
      id: site.id,
      kind: "memorySite" as const,
      position: site.position,
      interactionRadius: 2.4,
      prompt:
        site.type === "voice"
          ? "Press E to play voice note"
          : site.type === "photo"
            ? "Press E to view photo"
            : site.type === "video"
              ? "Press E to watch video"
              : "Press E to read note",
      payload: site,
    }));

  return [...messageInteractables, ...memoryInteractables];
}

export function findNearbyInteractable(
  playerPosition: THREE.Vector3,
  interactables: WorldInteractable[],
) {
  let nearest: WorldInteractable | null = null;
  let nearestDistance = Infinity;

  for (const item of interactables) {
    const distance = playerPosition.distanceTo(
      new THREE.Vector3(item.position.x, item.position.y, item.position.z),
    );

    if (distance < item.interactionRadius && distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }

  return nearest;
}
