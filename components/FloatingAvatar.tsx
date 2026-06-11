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
  bobbing?: boolean;
  onClick?: () => void;
};

const headGeometryByShape = {
  round: <sphereGeometry args={[0.34, 16, 16]} scale={[0.92, 1.12, 0.92]} />,
  tall: <cylinderGeometry args={[0.31, 0.31, 0.56, 12]} />,
  square: <boxGeometry args={[0.52, 0.52, 0.52]} />,
};

const torsoGeometryByShape = {
  box: <boxGeometry args={[0.5, 0.55, 0.38]} />,
  oval: <sphereGeometry args={[0.28, 16, 16]} scale={[1.15, 1.35, 0.95]} />,
  cone: <coneGeometry args={[0.3, 0.62, 10]} />,
  cylinder: <cylinderGeometry args={[0.24, 0.24, 0.58, 12]} />,
  pyramid: <coneGeometry args={[0.32, 0.62, 4]} />,
  cube: <boxGeometry args={[0.56, 0.56, 0.56]} />,
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
      bobbing = true,
      onClick,
    },
    ref,
  ) {
    const groupRef = useRef<Group>(null);
    const mouthColor = avatar.mouthColor;
    const eyeColor = avatar.eyeColor;

    useImperativeHandle(ref, () => groupRef.current as Group);

    useFrame(({ clock }) => {
      if (!groupRef.current) {
        return;
      }

      const lift = Number(groupRef.current.userData.verticalOffset ?? 0);
      const bob = bobbing
        ? Math.sin(clock.elapsedTime * 2 + floatOffset) * 0.08
        : 0;
      groupRef.current.position.y = position[1] + lift + bob;
    });

    const eyePositions = [-0.16, 0.16] as const;

    return (
      <group ref={groupRef} position={position} scale={scale} onClick={onClick}>
        {showName && name ? (
          <Html
            center
            position={[0, 1.55, 0]}
            className="pointer-events-none select-none"
          >
            <div
              className="whitespace-nowrap rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.1)] backdrop-blur"
              style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
            >
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
                {avatar.hairStyle === "buzz" ? (
                  <mesh castShadow position={[0, 0.05, 0]}>
                    <sphereGeometry args={[0.33, 18, 18]} />
                    <meshStandardMaterial
                      color={avatar.hairColor}
                      roughness={0.85}
                    />
                  </mesh>
                ) : null}
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
                {avatar.hairStyle === "curly" ? (
                  <>
                    <mesh castShadow position={[0, 0.02, 0]}>
                      <sphereGeometry args={[0.34, 14, 14]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.8}
                      />
                    </mesh>
                    {[-0.22, -0.08, 0.08, 0.22].map((offset, index) => (
                      <mesh
                        key={`${offset}-${index}`}
                        castShadow
                        position={[offset, 0.28, 0.1]}
                      >
                        <sphereGeometry args={[0.09, 10, 10]} />
                        <meshStandardMaterial
                          color={avatar.hairColor}
                          roughness={0.82}
                        />
                      </mesh>
                    ))}
                  </>
                ) : null}
                {avatar.hairStyle === "doubleBun" ? (
                  <>
                    <mesh castShadow position={[0, 0.05, 0]}>
                      <sphereGeometry args={[0.34, 14, 14]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.78}
                      />
                    </mesh>
                    {[-0.2, 0.2].map((offset) => (
                      <mesh
                        key={offset}
                        castShadow
                        position={[offset, 0.42, -0.02]}
                      >
                        <sphereGeometry args={[0.13, 12, 12]} />
                        <meshStandardMaterial
                          color={avatar.hairColor}
                          roughness={0.8}
                        />
                      </mesh>
                    ))}
                  </>
                ) : null}
                {avatar.hairStyle === "hairDown" ? (
                  <>
                    <mesh castShadow position={[0, 0.04, 0]}>
                      <sphereGeometry args={[0.35, 14, 14]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.8}
                      />
                    </mesh>
                    <mesh castShadow position={[-0.28, -0.08, 0.02]}>
                      <capsuleGeometry args={[0.1, 0.48, 6, 10]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.82}
                      />
                    </mesh>
                    <mesh castShadow position={[0.28, -0.08, 0.02]}>
                      <capsuleGeometry args={[0.1, 0.48, 6, 10]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.82}
                      />
                    </mesh>
                    <mesh castShadow position={[0, -0.2, -0.08]}>
                      <capsuleGeometry args={[0.11, 0.58, 6, 10]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.82}
                      />
                    </mesh>
                  </>
                ) : null}
                {avatar.hairStyle === "ponyTail" ? (
                  <>
                    <mesh castShadow position={[0, 0.08, 0]}>
                      <sphereGeometry args={[0.34, 14, 14]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.8}
                      />
                    </mesh>
                    <mesh castShadow position={[0, -0.02, -0.22]}>
                      <cylinderGeometry args={[0.08, 0.12, 0.42, 8]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.78}
                      />
                    </mesh>
                    <mesh castShadow position={[0, -0.16, -0.3]}>
                      <sphereGeometry args={[0.12, 12, 12]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.78}
                      />
                    </mesh>
                  </>
                ) : null}
                {avatar.hairStyle === "pigtails" ? (
                  <>
                    <mesh castShadow position={[0, 0.06, 0]}>
                      <sphereGeometry args={[0.34, 14, 14]} />
                      <meshStandardMaterial
                        color={avatar.hairColor}
                        roughness={0.78}
                      />
                    </mesh>
                    {[-0.26, 0.26].map((offset) => (
                      <group key={offset} position={[offset, 0.18, -0.02]}>
                        <mesh castShadow>
                          <cylinderGeometry args={[0.06, 0.09, 0.38, 8]} />
                          <meshStandardMaterial
                            color={avatar.hairColor}
                            roughness={0.78}
                          />
                        </mesh>
                        <mesh castShadow position={[0, -0.24, 0]}>
                          <sphereGeometry args={[0.1, 10, 10]} />
                          <meshStandardMaterial
                            color={avatar.hairColor}
                            roughness={0.8}
                          />
                        </mesh>
                      </group>
                    ))}
                  </>
                ) : null}
              </group>
            ) : null}

            <group position={[0, 0.02, 0.31]}>
              {avatar.eyes === "tenEyes" ? (
                <>
                  {[-0.22, -0.11, 0, 0.11, 0.22].map((x) => (
                    <mesh key={`top-${x}`} castShadow position={[x, 0.12, 0]}>
                      <sphereGeometry args={[0.022, 8, 8]} />
                      <meshStandardMaterial color={eyeColor} roughness={0.55} />
                    </mesh>
                  ))}
                  {[-0.22, -0.11, 0, 0.11, 0.22].map((x) => (
                    <mesh
                      key={`bottom-${x}`}
                      castShadow
                      position={[x, -0.02, 0]}
                    >
                      <sphereGeometry args={[0.022, 8, 8]} />
                      <meshStandardMaterial color={eyeColor} roughness={0.55} />
                    </mesh>
                  ))}
                </>
              ) : avatar.eyes === "arc" ? (
                eyePositions.map((x) => (
                  <mesh
                    key={x}
                    castShadow
                    position={[x, 0.05, 0]}
                    rotation={[Math.PI, 0, 0]}
                  >
                    <torusGeometry args={[0.07, 0.018, 8, 14, Math.PI]} />
                    <meshStandardMaterial color={eyeColor} roughness={0.55} />
                  </mesh>
                ))
              ) : avatar.eyes === "sparkle" ? (
                eyePositions.map((x) => (
                  <group key={x} position={[x, 0.05, 0]}>
                    <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
                      <boxGeometry args={[0.03, 0.12, 0.02]} />
                      <meshStandardMaterial color={eyeColor} roughness={0.45} />
                    </mesh>
                    <mesh castShadow rotation={[0, 0, -Math.PI / 4]}>
                      <boxGeometry args={[0.03, 0.12, 0.02]} />
                      <meshStandardMaterial color={eyeColor} roughness={0.45} />
                    </mesh>
                  </group>
                ))
              ) : (
                eyePositions.map((x) => (
                  <mesh key={x} castShadow position={[x, 0.05, 0]}>
                    {avatar.eyes === "wink" && x < 0 ? (
                      <boxGeometry args={[0.1, 0.02, 0.03]} />
                    ) : avatar.eyes === "wink" && x > 0 ? (
                      <sphereGeometry args={[0.038, 8, 8]} />
                    ) : avatar.eyes === "dots" ? (
                      <sphereGeometry args={[0.038, 8, 8]} />
                    ) : avatar.eyes === "oval" ? (
                      <sphereGeometry
                        args={[0.036, 8, 8]}
                        scale={[1.5, 0.7, 1]}
                      />
                    ) : avatar.eyes === "lines" ? (
                      <boxGeometry args={[0.02, 0.08, 0.03]} />
                    ) : (
                      <boxGeometry args={[0.08, 0.02, 0.03]} />
                    )}
                    <meshStandardMaterial color={eyeColor} roughness={0.55} />
                  </mesh>
                ))
              )}
            </group>

            <mesh castShadow position={[0, -0.11, 0.32]}>
              {avatar.mouth === "smile" ? (
                <>
                  <mesh position={[0, -0.02, 0]} rotation={[Math.PI, 0, 0]}>
                    <torusGeometry args={[0.12, 0.018, 8, 16, Math.PI]} />
                    <meshStandardMaterial color={mouthColor} roughness={0.6} />
                  </mesh>
                </>
              ) : avatar.mouth === "flat" ? (
                <>
                  <boxGeometry args={[0.16, 0.02, 0.03]} />
                  <meshStandardMaterial color={mouthColor} roughness={0.6} />
                </>
              ) : avatar.mouth === "open" ? (
                <>
                  <sphereGeometry
                    args={[0.048, 10, 10]}
                    scale={[1.5, 1.25, 1]}
                  />
                  <meshStandardMaterial color={mouthColor} roughness={0.6} />
                </>
              ) : avatar.mouth === "grin" ? (
                <mesh position={[0, -0.01, 0]} rotation={[Math.PI, 0, 0]}>
                  <torusGeometry args={[0.14, 0.02, 8, 18, Math.PI * 0.85]} />
                  <meshStandardMaterial color={mouthColor} roughness={0.6} />
                </mesh>
              ) : (
                <>
                  <mesh
                    position={[0.03, -0.01, 0]}
                    rotation={[Math.PI, 0, 0.18]}
                  >
                    <torusGeometry args={[0.1, 0.015, 8, 16, Math.PI * 0.7]} />
                    <meshStandardMaterial color={mouthColor} roughness={0.6} />
                  </mesh>
                  <mesh position={[-0.06, -0.01, 0.01]}>
                    <sphereGeometry args={[0.022, 8, 8]} />
                    <meshStandardMaterial color={mouthColor} roughness={0.6} />
                  </mesh>
                </>
              )}
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

            {avatar.accessory === "monocle" ? (
              <group position={[0.15, 0.05, 0.34]}>
                <mesh castShadow>
                  <torusGeometry args={[0.08, 0.012, 10, 16]} />
                  <meshStandardMaterial color="#6b7280" roughness={0.35} />
                </mesh>
                <mesh castShadow position={[0, -0.16, 0]}>
                  <boxGeometry args={[0.01, 0.18, 0.01]} />
                  <meshStandardMaterial color="#6b7280" roughness={0.35} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "toteBag" ? (
              <group position={[0.42, -0.42, 0.06]} rotation={[0, 0, 0.08]}>
                <mesh castShadow position={[0, -0.04, 0]}>
                  <boxGeometry args={[0.28, 0.34, 0.18]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.75} />
                </mesh>
                <mesh castShadow position={[0, 0.15, 0]}>
                  <torusGeometry args={[0.1, 0.02, 8, 14, Math.PI]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.75} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "inflatablePoolRing" ? (
              <mesh
                castShadow
                position={[0, -0.34, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <torusGeometry args={[0.52, 0.13, 12, 24]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.7} />
              </mesh>
            ) : null}

            {avatar.accessory === "banana" ? (
              <group position={[0.38, 0.22, 0.18]} rotation={[0.3, 0.4, -0.8]}>
                <mesh castShadow>
                  <torusGeometry args={[0.16, 0.05, 6, 16, Math.PI * 0.9]} />
                  <meshStandardMaterial color="#facc15" roughness={0.8} />
                </mesh>
                <mesh castShadow position={[0.12, -0.08, 0]}>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial color="#7c3f00" roughness={0.8} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "pizzaHat" ? (
              <group position={[0, 0.44, 0]} rotation={[0, 0, -0.08]}>
                <mesh castShadow position={[0, 0.14, 0]}>
                  <coneGeometry args={[0.2, 0.42, 8]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.8} />
                </mesh>
                {[-0.06, 0.02, 0.08].map((x, index) => (
                  <mesh
                    key={index}
                    castShadow
                    position={[x, 0.22 + index * 0.02, 0.02]}
                  >
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshStandardMaterial color="#ef4444" roughness={0.7} />
                  </mesh>
                ))}
                <mesh castShadow position={[0, 0.32, 0]}>
                  <boxGeometry args={[0.08, 0.02, 0.08]} />
                  <meshStandardMaterial color="#16a34a" roughness={0.6} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "moustache" ? (
              <group position={[0, -0.01, 0.33]}>
                <mesh
                  castShadow
                  position={[0, 0, 0]}
                  rotation={[Math.PI, 0, 0]}
                >
                  <torusGeometry args={[0.11, 0.018, 8, 20, Math.PI * 0.9]} />
                  <meshStandardMaterial color="#6b3f2a" roughness={0.7} />
                </mesh>
                <mesh
                  castShadow
                  position={[0.1, -0.02, 0]}
                  rotation={[0, 0, -0.35]}
                >
                  <boxGeometry args={[0.08, 0.03, 0.02]} />
                  <meshStandardMaterial color="#6b3f2a" roughness={0.7} />
                </mesh>
                <mesh
                  castShadow
                  position={[-0.1, -0.02, 0]}
                  rotation={[0, 0, 0.35]}
                >
                  <boxGeometry args={[0.08, 0.03, 0.02]} />
                  <meshStandardMaterial color="#6b3f2a" roughness={0.7} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "trafficConeHat" ? (
              <group position={[0, 0.44, 0]}>
                <mesh castShadow position={[0, 0.14, 0]}>
                  <coneGeometry args={[0.2, 0.5, 4]} />
                  <meshStandardMaterial color="#f97316" roughness={0.78} />
                </mesh>
                {[-0.12, 0, 0.12].map((y, index) => (
                  <mesh
                    key={index}
                    castShadow
                    position={[0, 0.08 + y * 0.5, 0.12]}
                    rotation={[0.08, 0, 0]}
                  >
                    <boxGeometry args={[0.24, 0.03, 0.02]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.6} />
                  </mesh>
                ))}
              </group>
            ) : null}

            {avatar.accessory === "cape" ? (
              <group position={[0, -0.34, -0.28]}>
                <mesh castShadow>
                  <boxGeometry args={[0.75, 0.9, 0.08]} />
                  <meshStandardMaterial color="#7c3aed" roughness={0.85} />
                </mesh>
                <mesh castShadow position={[0, 0.5, 0]}>
                  <boxGeometry args={[0.24, 0.08, 0.08]} />
                  <meshStandardMaterial color="#7c3aed" roughness={0.85} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "wizardHat" ? (
              <group position={[0, 0.46, 0]}>
                <mesh castShadow position={[0, 0.18, 0]}>
                  <coneGeometry args={[0.2, 0.62, 6]} />
                  <meshStandardMaterial color="#4f46e5" roughness={0.72} />
                </mesh>
                <mesh castShadow position={[0, 0.02, 0]}>
                  <torusGeometry args={[0.18, 0.03, 8, 16]} />
                  <meshStandardMaterial color="#eab308" roughness={0.55} />
                </mesh>
                <mesh castShadow position={[0.02, 0.26, 0.08]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.4} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "baguette" ? (
              <group position={[0.45, 0.18, 0.1]} rotation={[0.35, 0.15, 0.9]}>
                <mesh castShadow>
                  <capsuleGeometry args={[0.06, 0.48, 4, 10]} />
                  <meshStandardMaterial color="#d97706" roughness={0.88} />
                </mesh>
                {[-0.12, -0.02, 0.08].map((z, index) => (
                  <mesh
                    key={index}
                    castShadow
                    position={[0.06, z, 0]}
                    rotation={[0, 0, 0.08]}
                  >
                    <boxGeometry args={[0.03, 0.16, 0.01]} />
                    <meshStandardMaterial color="#fbbf24" roughness={0.85} />
                  </mesh>
                ))}
              </group>
            ) : null}

            {avatar.accessory === "haloHat" ? (
              <group position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0.25]}>
                <mesh castShadow>
                  <torusGeometry args={[0.28, 0.035, 10, 24]} />
                  <meshStandardMaterial color="#fde68a" roughness={0.35} />
                </mesh>
                <mesh
                  castShadow
                  position={[0.02, 0.18, 0]}
                  rotation={[0, 0, -0.25]}
                >
                  <boxGeometry args={[0.04, 0.24, 0.04]} />
                  <meshStandardMaterial color="#fde68a" roughness={0.35} />
                </mesh>
              </group>
            ) : null}

            {avatar.accessory === "cloudHat" ? (
              <group position={[0, 0.5, 0]}>
                {[-0.16, 0, 0.16].map((x) => (
                  <mesh
                    key={x}
                    castShadow
                    position={[x, 0.06 + Math.abs(x) * 0.1, 0]}
                  >
                    <sphereGeometry args={[0.15, 14, 14]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.9} />
                  </mesh>
                ))}
                <mesh castShadow position={[0, -0.02, 0]}>
                  <boxGeometry args={[0.48, 0.16, 0.22]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.9} />
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
