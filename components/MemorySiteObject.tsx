"use client";

import { Html } from "@react-three/drei";
import type { MemorySite } from "@/lib/types";

type MemorySiteObjectProps = {
  site: MemorySite;
  onClick?: () => void;
  showLabel?: boolean;
};

export function MemorySiteObject({
  site,
  onClick,
  showLabel = true,
}: MemorySiteObjectProps) {
  return (
    <group
      position={[site.position.x, site.position.y, site.position.z]}
      rotation={[0, site.rotationY ?? 0, 0]}
      onClick={onClick}
    >
      {showLabel ? (
        <Html
          center
          position={[0, 1.45, 0]}
          className="pointer-events-none select-none"
        >
          <div
            className="whitespace-nowrap rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.1)] backdrop-blur"
            style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
          >
            {site.title}
          </div>
        </Html>
      ) : null}

      {site.type === "voice" ? (
        <group>
          <mesh castShadow position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.32, 0.36, 0.2, 10]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 0.38, 0]}>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshStandardMaterial
              color="#38bdf8"
              roughness={0.5}
              emissive="#7dd3fc"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh castShadow position={[0, 0.58, 0]}>
            <torusGeometry args={[0.22, 0.03, 10, 16]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.55} />
          </mesh>
        </group>
      ) : null}

      {site.type === "photo" ? (
        <group>
          <mesh castShadow position={[0, 0.38, 0]}>
            <boxGeometry args={[0.92, 1.16, 0.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 0.45, 0.06]}>
            <boxGeometry args={[0.66, 0.72, 0.04]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, -0.22, 0]}>
            <boxGeometry args={[0.38, 0.12, 0.16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
          </mesh>
        </group>
      ) : null}

      {site.type === "video" ? (
        <group>
          <mesh castShadow position={[0, 0.46, 0]}>
            <boxGeometry args={[1.1, 0.7, 0.12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.75} />
          </mesh>
          <mesh castShadow position={[0, 0.46, 0.07]}>
            <boxGeometry args={[0.92, 0.52, 0.03]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#7dd3fc"
              emissiveIntensity={0.15}
              roughness={0.5}
            />
          </mesh>
          <mesh castShadow position={[0, -0.06, 0]}>
            <boxGeometry args={[0.26, 0.18, 0.14]} />
            <meshStandardMaterial color="#475569" roughness={0.8} />
          </mesh>
        </group>
      ) : null}

      {site.type === "note" ? (
        <group>
          <mesh
            castShadow
            position={[0, 0.38, 0]}
            rotation={[0.12, 0.18, 0.04]}
          >
            <boxGeometry args={[0.92, 0.8, 0.06]} />
            <meshStandardMaterial color="#fde68a" roughness={0.92} />
          </mesh>
          <mesh
            castShadow
            position={[0, 0.38, 0.04]}
            rotation={[0.12, 0.18, 0.04]}
          >
            <boxGeometry args={[0.68, 0.02, 0.02]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.8} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
