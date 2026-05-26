"use client";

import { Html } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { AvatarConfig } from "@/lib/types";

type FloatingAvatarProps = {
  avatar: AvatarConfig;
  name?: string;
  position?: [number, number, number];
  scale?: number;
  showName?: boolean;
  highlight?: boolean;
  floatOffset?: number;
  onClick?: () => void;
};

const headGeometryByShape = {
  round: <sphereGeometry args={[0.36, 16, 16]} />,
  tall: <sphereGeometry args={[0.34, 16, 16]} scale={[0.92, 1.12, 0.92]} />,
  wide: <sphereGeometry args={[0.35, 16, 16]} scale={[1.08, 0.95, 1.02]} />,
};

const torsoGeometryByShape = {
  box: <boxGeometry args={[0.5, 0.55, 0.38]} />,
  oval: <sphereGeometry args={[0.28, 16, 16]} scale={[1.15, 1.35, 0.95]} />,
  cone: <coneGeometry args={[0.3, 0.62, 10]} />,
};

export const FloatingAvatar = forwardRef<Group, FloatingAvatarProps>(
  function FloatingAvatar(
    {
      avatar,
      name,
      position = [0, 0, 0],
      scale = 1,
      showName = true,
      highlight = false,
      floatOffset = 0,
      onClick,
    },
    ref,
  ) {
    const groupRef = useRef<Group>(null);

    useImperativeHandle(ref, () => groupRef.current as Group);

    useFrame(({ clock }) => {
      if (!groupRef.current) {
        return;
      }

      const bob = Math.sin(clock.elapsedTime * 2 + floatOffset) * 0.08;
      groupRef.current.position.y = position[1] + bob;
    });

    const eyePositions = [-0.14, 0.14] as const;

    return (
      <group ref={groupRef} position={position} scale={scale} onClick={onClick}>
        {showName && name ? (
          <Html
            center
            position={[0, 1.55, 0]}
            className="pointer-events-none select-none"
          >
            <div className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.1)] backdrop-blur">
              {name}
            </div>
          </Html>
        ) : null}

        <group position={[0, 0.68, 0]}>
          <group position={[0, 0.42, 0]}>
            <mesh castShadow>
              {headGeometryByShape[avatar.headShape]}
              <meshStandardMaterial
                color={avatar.skinColor}
                roughness={0.78}
                metalness={0.02}
              />
            </mesh>

            {avatar.hairStyle !== "bald" ? (
              <group position={[0, 0.26, 0]}>
                {avatar.hairStyle === "cap" ? (
                  <mesh castShadow position={[0, 0.06, 0]}>
                    <cylinderGeometry args={[0.39, 0.41, 0.22, 10]} />
                    <meshStandardMaterial
                      color={avatar.hairColor}
                      roughness={0.72}
                    />
                  </mesh>
                ) : null}
                {avatar.hairStyle === "spiky" ? (
                  <>
                    <mesh castShadow position={[0, 0.08, 0]}>
                      <sphereGeometry
                        args={[0.34, 10, 10]}
                        scale={[1.05, 0.75, 1.02]}
                      />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.72}
                      />
                    </mesh>
                    {[-0.22, 0, 0.22].map((offset) => (
                      <mesh key={offset} castShadow position={[offset, 0.4, 0]}>
                        <coneGeometry args={[0.05, 0.3, 6]} />
                        <meshStandardMaterial
                          color={avatar.hairColor}
                          roughness={0.72}
                        />
                      </mesh>
                    ))}
                  </>
                ) : null}
                {avatar.hairStyle === "sidePart" ? (
                  <>
                    <mesh castShadow position={[0, 0.02, 0]}>
                      <sphereGeometry
                        args={[0.34, 10, 10]}
                        scale={[1.08, 0.78, 1.02]}
                      />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.72}
                      />
                    </mesh>
                    <mesh
                      castShadow
                      position={[0.09, 0.19, 0.17]}
                      rotation={[0.2, 0.2, -0.2]}
                    >
                      <boxGeometry args={[0.22, 0.18, 0.2]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.72}
                      />
                    </mesh>
                  </>
                ) : null}
              </group>
            ) : null}

            <group position={[0, 0.02, 0.31]}>
              {eyePositions.map((x) => (
                <mesh key={x} castShadow position={[x, 0.05, 0]}>
                  {avatar.eyes === "dots" ? (
                    <sphereGeometry args={[0.038, 8, 8]} />
                  ) : avatar.eyes === "oval" ? (
                    <sphereGeometry
                      args={[0.036, 8, 8]}
                      scale={[1.15, 0.85, 1]}
                    />
                  ) : (
                    <boxGeometry args={[0.08, 0.02, 0.03]} />
                  )}
                  <meshStandardMaterial color="#1f2937" roughness={0.55} />
                </mesh>
              ))}
            </group>

            <mesh castShadow position={[0, -0.11, 0.32]}>
              {avatar.mouth === "smile" ? (
                <torusGeometry args={[0.1, 0.02, 6, 12, Math.PI]} />
              ) : avatar.mouth === "flat" ? (
                <boxGeometry args={[0.16, 0.02, 0.03]} />
              ) : (
                <sphereGeometry args={[0.032, 8, 8]} />
              )}
              <meshStandardMaterial color="#8b3f3f" roughness={0.6} />
            </mesh>

            {avatar.accessory === "glasses" ? (
              <group position={[0, 0.06, 0.33]}>
                {[-0.14, 0.14].map((x) => (
                  <mesh key={x} castShadow position={[x, 0, 0]}>
                    <torusGeometry args={[0.06, 0.01, 8, 14]} />
                    <meshStandardMaterial color="#334155" roughness={0.45} />
                  </mesh>
                ))}
                <mesh castShadow position={[0, 0, 0]}>
                  <boxGeometry args={[0.12, 0.01, 0.01]} />
                  <meshStandardMaterial color="#334155" roughness={0.45} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "hat" ? (
              <group position={[0, 0.43, 0]}>
                <mesh castShadow position={[0, 0.1, 0]}>
                  <cylinderGeometry args={[0.25, 0.28, 0.18, 8]} />
                  <meshStandardMaterial
                    color={avatar.hairColor}
                    roughness={0.7}
                  />
                </mesh>
                <mesh castShadow position={[0, 0.25, 0]}>
                  <boxGeometry args={[0.36, 0.08, 0.28]} />
                  <meshStandardMaterial
                    color={avatar.hairColor}
                    roughness={0.7}
                  />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "partyHat" ? (
              <group position={[0.18, 0.44, 0]} rotation={[0, 0, -0.35]}>
                <mesh castShadow position={[0, 0.18, 0]}>
                  <coneGeometry args={[0.18, 0.48, 6]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.7} />
                </mesh>
                <mesh castShadow position={[0, 0.42, 0.02]}>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.6} />
                </mesh>
              </group>
            ) : null}

            {highlight ? (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
                <ringGeometry args={[0.34, 0.42, 18]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
              </mesh>
            ) : null}
          </group>

          <mesh castShadow position={[0, -0.18, 0]}>
            {torsoGeometryByShape[avatar.torsoShape]}
            <meshStandardMaterial
              color={avatar.shirtColor}
              roughness={0.76}
              metalness={0.02}
            />
          </mesh>
        </group>
      </group>
    );
  },
);
