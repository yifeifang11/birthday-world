"use client";

import { Canvas } from "@react-three/fiber";
import { FloatingAvatar } from "./FloatingAvatar";
import type { AvatarConfig } from "@/lib/types";

type AvatarPreviewProps = {
  avatar: AvatarConfig;
  name: string;
};

export function AvatarPreview({ avatar, name }: AvatarPreviewProps) {
  return (
    <div className="h-[22rem] overflow-hidden rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(214,247,255,0.75))] shadow-[0_25px_80px_rgba(15,23,42,0.14)]">
      <Canvas camera={{ position: [0, 1.5, 4.4], fov: 38 }} shadows>
        <ambientLight intensity={1.15} />
        <directionalLight position={[2.5, 4, 4]} intensity={1.5} castShadow />
        <color attach="background" args={["#dff6ff"]} />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          position={[0, -0.9, 0]}
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#e8f7ef" />
        </mesh>
        <FloatingAvatar
          avatar={avatar}
          name={name}
          scale={1.35}
          position={[0, -0.4, 0]}
        />
      </Canvas>
    </div>
  );
}
