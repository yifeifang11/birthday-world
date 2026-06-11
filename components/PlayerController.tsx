"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { findNearbyInteractable } from "@/lib/interactables";
import type { WorldInteractable } from "@/lib/types";

type PlayerControllerProps = {
  playerRef: React.RefObject<THREE.Group | null>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  interactables: WorldInteractable[];
  obstacleZones?: { x: number; z: number; radius: number }[];
  onNearbyChange: (value: WorldInteractable | null) => void;
  onInteract: (value: WorldInteractable) => void;
  onClose: () => void;
};

type KeyState = Record<string, boolean>;

export function PlayerController({
  playerRef,
  controlsRef,
  interactables,
  obstacleZones = [],
  onNearbyChange,
  onInteract,
  onClose,
}: PlayerControllerProps) {
  const keys = useRef<KeyState>({});
  const activeInteractable = useRef<WorldInteractable | null>(null);
  const verticalVelocity = useRef(0);
  const grounded = useRef(true);
  const groundY = 0.05;
  const jumpVelocity = 6.5;
  const gravity = 16;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
      }

      keys.current[event.key.toLowerCase()] = true;

      if (event.key === " " && grounded.current) {
        verticalVelocity.current = jumpVelocity;
        grounded.current = false;
      }

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
      const nextX = player.position.x + direction.x * speed * delta;
      const nextZ = player.position.z + direction.z * speed * delta;
      const collisionPadding = 0.45;

      const isBlocked = (x: number, z: number) =>
        obstacleZones.some((zone) => {
          const dx = x - zone.x;
          const dz = z - zone.z;
          const minDistance = zone.radius + collisionPadding;
          return dx * dx + dz * dz < minDistance * minDistance;
        });

      let moved = false;

      if (!isBlocked(nextX, nextZ)) {
        player.position.x = nextX;
        player.position.z = nextZ;
        moved = true;
      } else {
        const canMoveX = !isBlocked(nextX, player.position.z);
        const canMoveZ = !isBlocked(player.position.x, nextZ);

        if (canMoveX) {
          player.position.x = nextX;
          moved = true;
        }

        if (canMoveZ) {
          player.position.z = nextZ;
          moved = true;
        }
      }

      if (moved) {
        player.rotation.y = Math.atan2(direction.x, direction.z);
      }
    }

    verticalVelocity.current -= gravity * delta;
    player.position.y += verticalVelocity.current * delta;

    if (player.position.y <= groundY) {
      player.position.y = groundY;
      verticalVelocity.current = 0;
      grounded.current = true;
    }

    player.userData.verticalOffset = player.position.y - groundY;

    const targetPosition = new THREE.Vector3(
      player.position.x,
      player.position.y + 1.1,
      player.position.z,
    );

    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(targetPosition);
      controls.update();
    }

    const nearby = findNearbyInteractable(player.position, interactables);

    if (nearby?.id !== activeInteractable.current?.id) {
      activeInteractable.current = nearby;
      onNearbyChange(nearby);
    }
  });

  return null;
}
