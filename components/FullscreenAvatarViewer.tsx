"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FloatingAvatar } from "./FloatingAvatar";
import type { AvatarConfig } from "@/lib/types";
import {
  avatarShapeOptions,
  eyeColorOptions,
  hairColorOptions,
  mouthColorOptions,
  shirtColorOptions,
  skinToneOptions,
  toLabel,
} from "@/lib/avatarOptions";

type Props = {
  avatar: AvatarConfig;
  setAvatar: (s: AvatarConfig) => void;
  focusedKey?: keyof AvatarConfig;
  onSave?: () => Promise<void> | void;
  onContinue?: () => void;
};

const focusKeys: (keyof AvatarConfig)[] = [
  "hairStyle",
  "hairColor",
  "headShape",
  "skinColor",
  "eyes",
  "eyeColor",
  "mouth",
  "mouthColor",
  "torsoShape",
  "shirtColor",
  "accessory",
];

const optionMap = {
  skinColor: skinToneOptions,
  hairColor: hairColorOptions,
  eyeColor: eyeColorOptions,
  mouthColor: mouthColorOptions,
  shirtColor: shirtColorOptions,
  headShape: avatarShapeOptions.headShape,
  torsoShape: avatarShapeOptions.torsoShape,
  hairStyle: avatarShapeOptions.hairStyle,
  eyes: avatarShapeOptions.eyes,
  mouth: avatarShapeOptions.mouth,
  accessory: avatarShapeOptions.accessory,
} as const satisfies Record<keyof AvatarConfig, readonly string[]>;

const displayLabels: Partial<Record<keyof AvatarConfig, string>> = {
  skinColor: "Skin tone",
  eyeColor: "Eye color",
  mouthColor: "Mouth color",
  shirtColor: "Torso color",
};

export function FullscreenAvatarViewer({
  avatar,
  setAvatar,
  focusedKey = "hairStyle",
  onSave,
  onContinue,
}: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeKey, setActiveKey] = useState<keyof AvatarConfig>(focusedKey);

  function getOptionsForKey(key: keyof AvatarConfig): readonly string[] {
    return optionMap[key];
  }

  const stepFocus = useCallback(
    (dir: -1 | 1) => {
      const currentIndex = focusKeys.indexOf(activeKey);
      const nextIndex =
        (currentIndex + dir + focusKeys.length) % focusKeys.length;
      setActiveKey(focusKeys[nextIndex]);
    },
    [activeKey],
  );

  const cycle = useCallback(
    (dir: -1 | 1) => {
      const opts = getOptionsForKey(activeKey);
      if (!opts || opts.length === 0) return;
      const cur = avatar[activeKey];
      const idx = Math.max(0, opts.indexOf(cur));
      const next = opts[(idx + dir + opts.length) % opts.length];
      setAvatar({ ...avatar, [activeKey]: next } as AvatarConfig);
    },
    [activeKey, avatar, setAvatar],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp") stepFocus(-1);
      if (e.key === "ArrowDown") stepFocus(1);
      if (e.key === "ArrowLeft") cycle(-1);
      if (e.key === "ArrowRight") cycle(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle, stepFocus]);

  const opts = getOptionsForKey(activeKey);
  const curValue = avatar[activeKey];
  const label = displayLabels[activeKey] ?? toLabel(String(activeKey));

  async function handleSave() {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-linear-to-b from-sky-50 to-white/80">
      <Canvas camera={{ position: [0, 1.45, 6.4], fov: 45 }} shadows>
        <ambientLight intensity={1.1} />
        <directionalLight position={[2.5, 4, 4]} intensity={1.5} castShadow />
        <color attach="background" args={["#e6f8ff"]} />
        <OrbitControls
          enablePan={false}
          enableZoom
          minPolarAngle={Math.PI / 2.7}
          maxPolarAngle={Math.PI / 2.7}
          minDistance={4.4}
          maxDistance={8.5}
          zoomSpeed={0.8}
          minAzimuthAngle={-Infinity}
          maxAzimuthAngle={Infinity}
          target={[0, 0.45, 0]}
        />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
          position={[0, -0.9, 0]}
        >
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial color="#f0fbf9" />
        </mesh>

        <FloatingAvatar
          avatar={avatar}
          name={"Lawrence"}
          scale={1.05}
          position={[0, -0.55, 0]}
          showName={false}
          highlight
        />
      </Canvas>

      <button
        aria-label="Previous attribute"
        onClick={() => stepFocus(-1)}
        className="absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-amber-400 px-8 py-6 text-5xl font-bold text-slate-950 shadow-xl ring-2 ring-amber-200"
      >
        ↑
      </button>

      <button
        aria-label="Next attribute"
        onClick={() => stepFocus(1)}
        className="absolute left-1/2 bottom-6 -translate-x-1/2 rounded-full bg-amber-400 px-8 py-6 text-5xl font-bold text-slate-950 shadow-xl ring-2 ring-amber-200"
      >
        ↓
      </button>

      <button
        aria-label="Previous"
        onClick={() => cycle(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-amber-400 px-8 py-7 text-7xl font-bold leading-none text-slate-950 shadow-xl ring-2 ring-amber-200"
      >
        ‹
      </button>

      <button
        aria-label="Next"
        onClick={() => cycle(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-amber-400 px-8 py-7 text-7xl font-bold leading-none text-slate-950 shadow-xl ring-2 ring-amber-200"
      >
        ›
      </button>

      <div className="absolute left-1/2 top-28 z-40 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 shadow">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        <div className="mt-1 text-xs text-slate-600 flex items-center gap-2">
          {opts && opts.length && curValue?.startsWith("#") ? (
            <span
              className="h-4 w-8 rounded"
              style={{ background: curValue }}
            />
          ) : null}
          <span>{curValue}</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-50 flex gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!onSave || isSaving}
          className="rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full bg-amber-400 px-8 py-4 text-base font-semibold text-slate-950 shadow-xl transition hover:bg-amber-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default FullscreenAvatarViewer;
