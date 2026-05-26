"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FloatingAvatar } from "./FloatingAvatar";
import { InteractionPrompt } from "./InteractionPrompt";
import { MemorySiteModal } from "./MemorySiteModal";
import { MemorySiteObject } from "./MemorySiteObject";
import { MessagePopup } from "./MessagePopup";
import { PlayerController } from "./PlayerController";
import { buildWorldInteractables } from "@/lib/interactables";
import { defaultAvatarConfig } from "@/lib/avatarOptions";
import { memorySites } from "@/lib/memorySites";
import type { MemorySite, PublicMessage, WorldInteractable } from "@/lib/types";

export function WorldScene() {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [worldMemorySites, setWorldMemorySites] =
    useState<MemorySite[]>(memorySites);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearby, setNearby] = useState<WorldInteractable | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<PublicMessage | null>(
    null,
  );
  const [selectedMemorySite, setSelectedMemorySite] =
    useState<MemorySite | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [messagesResponse, memorySitesResponse] = await Promise.all([
          fetch("/api/messages"),
          fetch("/api/memory-sites"),
        ]);

        if (!messagesResponse.ok) {
          throw new Error("Could not load submitted messages.");
        }

        if (!memorySitesResponse.ok) {
          throw new Error("Could not load memory sites.");
        }

        const nextMessages = (await messagesResponse.json()) as PublicMessage[];
        const nextMemorySites =
          (await memorySitesResponse.json()) as MemorySite[];

        if (isMounted) {
          setMessages(nextMessages);
          setWorldMemorySites(nextMemorySites);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load the world.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const interactables = buildWorldInteractables(messages, worldMemorySites);

  function handleInteract(value: WorldInteractable) {
    if (value.kind === "message") {
      setSelectedMessage(value.payload);
      setSelectedMemorySite(null);
      return;
    }

    setSelectedMemorySite(value.payload);
    setSelectedMessage(null);
  }

  function closePanels() {
    setSelectedMessage(null);
    setSelectedMemorySite(null);
  }

  return (
    <div className="world-shell relative h-screen w-screen overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 text-sm text-slate-700">
          Loading world...
        </div>
      ) : null}
      {error ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-rose-50/80 p-6 text-center text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <Canvas
        shadows
        camera={{ position: [0, 4.2, 7], fov: 45 }}
        className="absolute inset-0 h-full w-full"
      >
        <color attach="background" args={["#dff5ff"]} />
        <fog attach="fog" args={["#dff5ff", 16, 48]} />
        <ambientLight intensity={1.05} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <hemisphereLight
          intensity={0.55}
          color="#ffffff"
          groundColor="#c8f0dd"
        />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          position={[0, -0.95, 0]}
        >
          <planeGeometry args={[90, 90]} />
          <meshStandardMaterial color="#d9f2e5" />
        </mesh>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          position={[0, -0.93, 0]}
        >
          <ringGeometry args={[5, 5.8, 32]} />
          <meshStandardMaterial color="#bee9ff" transparent opacity={0.55} />
        </mesh>

        {[...Array(9)].map((_, index) => (
          <mesh
            key={index}
            castShadow
            position={[-18 + index * 4.5, -0.2, -12 + (index % 2) * 2.8]}
          >
            <boxGeometry args={[0.8, 0.8 + (index % 3) * 0.4, 0.8]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#f9a8d4" : "#fcd34d"}
              roughness={0.78}
            />
          </mesh>
        ))}

        {[...Array(6)].map((_, index) => (
          <group
            key={index}
            position={[-16 + index * 6.2, -0.95, 10 - (index % 2) * 2.5]}
          >
            <mesh castShadow position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 1.6, 8]} />
              <meshStandardMaterial color="#8b5e34" roughness={0.9} />
            </mesh>
            <mesh castShadow position={[0, 1.75, 0]}>
              <coneGeometry args={[0.9, 1.8, 8]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? "#4ade80" : "#22c55e"}
                roughness={0.85}
              />
            </mesh>
          </group>
        ))}

        {messages.map((message, index) => (
          <FloatingAvatar
            key={message.id}
            avatar={message.avatar}
            name={message.displayName}
            position={[
              message.position.x,
              message.position.y,
              message.position.z,
            ]}
            scale={1.02}
            floatOffset={index * 0.7}
            onClick={() =>
              handleInteract({
                id: message.id,
                kind: "message",
                position: message.position,
                interactionRadius: 2.2,
                prompt: "Press E to read message",
                payload: message,
              })
            }
          />
        ))}

        {worldMemorySites
          .filter((site) => site.enabled)
          .map((site) => (
            <MemorySiteObject
              key={site.id}
              site={site}
              onClick={() =>
                handleInteract({
                  id: site.id,
                  kind: "memorySite",
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
                })
              }
            />
          ))}

        <FloatingAvatar
          ref={playerRef}
          avatar={defaultAvatarConfig}
          name="You"
          position={[0, 0.05, 0]}
          scale={1.08}
          showName={false}
          highlight
        />
        <PlayerController
          playerRef={playerRef}
          interactables={interactables}
          onNearbyChange={setNearby}
          onInteract={handleInteract}
          onClose={closePanels}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-20 flex justify-center px-4">
        <div className="pointer-events-auto rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          {nearby?.prompt ?? "Move around to find messages and memory sites."}
        </div>
      </div>

      <InteractionPrompt prompt={nearby?.prompt ?? null} />
      <MessagePopup message={selectedMessage} onClose={closePanels} />
      <MemorySiteModal site={selectedMemorySite} onClose={closePanels} />

      {!loading && !error && messages.length === 0 ? (
        <div className="absolute bottom-6 left-6 max-w-md rounded-[1.5rem] border border-white/70 bg-white/80 p-4 text-sm text-slate-700 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          No approved messages yet. Submit one from the create page, then
          approve it in admin to see it in the world.
        </div>
      ) : null}
    </div>
  );
}
