"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { findNearbyInteractable } from "@/lib/interactables";
import type { WorldInteractable } from "@/lib/types";

type PlayerControllerProps = {
  playerRef: React.RefObject<THREE.Group | null>;
  interactables: WorldInteractable[];
  onNearbyChange: (value: WorldInteractable | null) => void;
  onInteract: (value: WorldInteractable) => void;
  onClose: () => void;
};

type KeyState = Record<string, boolean>;

export function PlayerController({
  playerRef,
  interactables,
  onNearbyChange,
  onInteract,
  onClose,
}: PlayerControllerProps) {
  const { camera } = useThree();
  const keys = useRef<KeyState>({});
  const activeInteractable = useRef<WorldInteractable | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = true;

      if (event.key.toLowerCase() === "e" && activeInteractable.current) {
        onInteract(activeInteractable.current);
      }

      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onClose, onInteract]);

  useFrame((_, delta) => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const speed = 4;
    const direction = new THREE.Vector3();

    if (keys.current.w || keys.current.arrowup) direction.z -= 1;
    if (keys.current.s || keys.current.arrowdown) direction.z += 1;
    if (keys.current.a || keys.current.arrowleft) direction.x -= 1;
    if (keys.current.d || keys.current.arrowright) direction.x += 1;

    if (direction.lengthSq() > 0) {
      direction.normalize();
      player.position.x += direction.x * speed * delta;
      player.position.z += direction.z * speed * delta;
      player.rotation.y = Math.atan2(direction.x, direction.z);
    }

    const targetPosition = new THREE.Vector3(
      player.position.x,
      player.position.y + 3.1,
      player.position.z + 5.2,
    );
    camera.position.lerp(targetPosition, 0.08);
    camera.lookAt(
      player.position.x,
      player.position.y + 1.15,
      player.position.z,
    );

    const nearby = findNearbyInteractable(player.position, interactables);

    if (nearby?.id !== activeInteractable.current?.id) {
      activeInteractable.current = nearby;
      onNearbyChange(nearby);
    }
  });

  return null;
}
