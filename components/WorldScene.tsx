"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { FloatingAvatar } from "./FloatingAvatar";
import { InteractionPrompt } from "./InteractionPrompt";
import { MemorySiteModal } from "./MemorySiteModal";
import { MemorySiteObject } from "./MemorySiteObject";
import { MessagePopup } from "./MessagePopup";
import { PlayerController } from "./PlayerController";
import { buildWorldInteractables } from "@/lib/interactables";
import { defaultAvatarConfig } from "@/lib/avatarOptions";
import { memorySites } from "@/lib/memorySites";
import type {
  AvatarConfig,
  MemorySite,
  PublicMessage,
  WorldInteractable,
} from "@/lib/types";

const pathStart = { x: -37, y: 0.05, z: 0 };
const mainAreaOffset = { x: 24, z: 0.8 };

const trailMarkers = [
  { x: -34, z: 0.45 },
  { x: -31, z: -0.65 },
  { x: -28, z: 1.15 },
  { x: -25, z: -1.35 },
  { x: -22, z: 1.95 },
  { x: -19, z: -2.25 },
  { x: -16, z: 2.55 },
  { x: -13, z: -2.45 },
  { x: -10, z: 2.35 },
  { x: -7, z: -1.95 },
  { x: -4, z: 1.45 },
  { x: -1, z: -1.05 },
  { x: 2, z: 0.85 },
  { x: 5, z: -0.65 },
  { x: 8, z: 0.55 },
  { x: 11, z: -0.45 },
  { x: 14, z: 0.35 },
  { x: 17, z: -0.28 },
  { x: 20, z: 0.22 },
  { x: 23, z: 0.08 },
];

const trailRocks = [
  { x: -27.2, z: -0.1, radius: 1.1, height: 1.25, color: "#8f8577" },
  { x: -23.5, z: 0.95, radius: 0.95, height: 1.05, color: "#9d9385" },
  { x: -20.3, z: -1.35, radius: 0.9, height: 1, color: "#857b6d" },
  { x: -14.6, z: 0.15, radius: 1.15, height: 1.35, color: "#948a7c" },
  { x: -11.2, z: -1.25, radius: 0.85, height: 0.9, color: "#a29789" },
  { x: -3.9, z: 0.2, radius: 1, height: 1.2, color: "#8e8476" },
  { x: 1.2, z: -0.6, radius: 0.8, height: 0.85, color: "#a69b8d" },
  { x: 6.7, z: 0.15, radius: 1.05, height: 1.18, color: "#928779" },
];

const trailLogs = [
  { x: -18.4, z: 0.28, length: 3.5, rotationY: 0.6 },
  { x: -8.8, z: 0.55, length: 3.1, rotationY: -0.5 },
  { x: 3.6, z: -0.12, length: 3.8, rotationY: 0.42 },
];

const obstacleZones = [
  ...trailRocks.map((rock) => ({ x: rock.x, z: rock.z, radius: rock.radius })),
  ...trailLogs.map((log) => ({ x: log.x, z: log.z, radius: 1.15 })),
];

function offsetPosition(
  position: { x: number; y: number; z: number },
  offset: { x: number; z: number },
) {
  return {
    x: position.x + offset.x,
    y: position.y,
    z: position.z + offset.z,
  };
}

export function WorldScene() {
  const [messages, setMessages] = useState<PublicMessage[]>([]);
  const [playerAvatar, setPlayerAvatar] =
    useState<AvatarConfig>(defaultAvatarConfig);
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
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [messagesResponse, memorySitesResponse, avatarSettingsResponse] =
          await Promise.all([
            fetch("/api/messages"),
            fetch("/api/memory-sites"),
            fetch("/api/avatar-settings"),
          ]);

        if (!messagesResponse.ok) {
          throw new Error("Could not load submitted messages.");
        }

        if (!memorySitesResponse.ok) {
          throw new Error("Could not load memory sites.");
        }

        if (!avatarSettingsResponse.ok) {
          throw new Error("Could not load avatar settings.");
        }

        const nextMessages = (await messagesResponse.json()) as PublicMessage[];
        const nextMemorySites =
          (await memorySitesResponse.json()) as MemorySite[];
        const avatarSettingsJson = (await avatarSettingsResponse.json()) as {
          ok?: boolean;
          settings?: AvatarConfig;
        };

        if (isMounted) {
          setMessages(nextMessages);
          setWorldMemorySites(nextMemorySites);
          setPlayerAvatar(avatarSettingsJson.settings ?? defaultAvatarConfig);
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

  const worldMessages = messages.map((message) => ({
    ...message,
    position: offsetPosition(message.position, mainAreaOffset),
  }));
  const interactables = buildWorldInteractables(
    worldMessages,
    worldMemorySites,
  );
  const pathVideoSites = worldMemorySites.filter(
    (site) => site.type === "video" && site.enabled,
  );
  const mainMemorySites = worldMemorySites.filter(
    (site) => site.type !== "video" && site.enabled,
  );
  const tagsHidden = Boolean(selectedMessage || selectedMemorySite);

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
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom
          enableDamping
          dampingFactor={0.08}
          minDistance={4.5}
          maxDistance={16}
          minPolarAngle={Math.PI / 4.8}
          maxPolarAngle={Math.PI / 2.08}
          target={[pathStart.x, pathStart.y + 1.1, pathStart.z]}
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
          position={[mainAreaOffset.x, -0.93, mainAreaOffset.z]}
        >
          <ringGeometry args={[5, 5.8, 32]} />
          <meshStandardMaterial color="#bee9ff" transparent opacity={0.55} />
        </mesh>

        {trailMarkers.map((marker, index) => (
          <mesh key={index} castShadow position={[marker.x, -0.18, marker.z]}>
            <boxGeometry args={[0.95, 0.22 + (index % 2) * 0.04, 0.95]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#f8e8c8" : "#f1d29f"}
              roughness={0.78}
            />
          </mesh>
        ))}

        {trailRocks.map((rock, index) => (
          <group key={`rock-${index}`} position={[rock.x, -0.95, rock.z]}>
            <mesh castShadow position={[0, rock.height * 0.48, 0]}>
              <dodecahedronGeometry args={[rock.radius, 0]} />
              <meshStandardMaterial color={rock.color} roughness={0.95} />
            </mesh>
            <mesh
              castShadow
              position={[rock.radius * 0.35, 0.2, -rock.radius * 0.3]}
            >
              <sphereGeometry args={[rock.radius * 0.24, 10, 10]} />
              <meshStandardMaterial color="#7f7467" roughness={0.96} />
            </mesh>
          </group>
        ))}

        {trailLogs.map((log, index) => (
          <mesh
            key={`log-${index}`}
            castShadow
            position={[log.x, -0.45, log.z]}
            rotation={[0, log.rotationY, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.23, 0.26, log.length, 12]} />
            <meshStandardMaterial color="#7c5133" roughness={0.84} />
          </mesh>
        ))}

        {[...Array(6)].map((_, index) => (
          <group
            key={index}
            position={[9.5 + index * 2.3, -0.95, 7.8 - (index % 2) * 3]}
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

        {worldMessages.map((message, index) => (
          <FloatingAvatar
            key={message.id}
            avatar={message.avatar}
            name={message.displayName}
            showName={!tagsHidden}
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

        {pathVideoSites.map((site) => (
          <MemorySiteObject
            key={site.id}
            site={site}
            showLabel={!tagsHidden}
            onClick={() =>
              handleInteract({
                id: site.id,
                kind: "memorySite",
                position: site.position,
                interactionRadius: 2.4,
                prompt: "Press E to watch video",
                payload: site,
              })
            }
          />
        ))}

        {mainMemorySites.map((site) => (
          <MemorySiteObject
            key={site.id}
            site={site}
            showLabel={!tagsHidden}
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
          avatar={playerAvatar}
          name="You"
          position={[pathStart.x, pathStart.y, pathStart.z]}
          scale={1.08}
          showName={false}
          highlight
          bobbing={false}
        />
        <PlayerController
          playerRef={playerRef}
          interactables={interactables}
          obstacleZones={obstacleZones}
          controlsRef={controlsRef}
          onNearbyChange={setNearby}
          onInteract={handleInteract}
          onClose={closePanels}
        />
      </Canvas>

      <InteractionPrompt prompt={nearby?.prompt ?? null} />
      <MessagePopup message={selectedMessage} onClose={closePanels} />
      <MemorySiteModal site={selectedMemorySite} onClose={closePanels} />

      {!loading && !error && messages.length === 0 ? (
        <div className="absolute bottom-6 left-6 max-w-md rounded-3xl border border-white/70 bg-white/80 p-4 text-sm text-slate-700 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          No approved messages yet. Submit one from the create page, then
          approve it in admin to see it in the world.
        </div>
      ) : null}
    </div>
  );
}
