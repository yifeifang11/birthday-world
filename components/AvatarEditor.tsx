"use client";

import { useState, useEffect } from "react";
import { AvatarPreview } from "./AvatarPreview";
import type { AvatarConfig } from "@/lib/types";
import {
  avatarShapeOptions,
  defaultAvatarConfig,
  eyeColorOptions,
  hairColorOptions,
  mouthColorOptions,
  shirtColorOptions,
  skinToneOptions,
  toLabel,
} from "@/lib/avatarOptions";

type AvatarEditorProps = {
  initial?: AvatarConfig | null;
  onSave?: (settings: AvatarConfig) => Promise<void> | void;
};

export function AvatarEditor({ initial, onSave }: AvatarEditorProps) {
  const [avatar, setAvatar] = useState<AvatarConfig>(
    initial ?? defaultAvatarConfig,
  );
  useEffect(() => {
    setAvatar(initial ?? defaultAvatarConfig);
  }, [initial]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      if (onSave) {
        await onSave(avatar);
      } else {
        // default: POST to API
        const res = await fetch("/api/avatar-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: avatar }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json?.error ?? "Save failed");
      }
      setStatus("Saved");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="panel-strong rounded-4xl p-6 md:p-8">
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Edit
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">
            Customize Character
          </h2>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-5">
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Skin
              <select
                value={avatar.skinColor}
                onChange={(e) =>
                  setAvatar({ ...avatar, skinColor: e.target.value })
                }
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950"
              >
                {skinToneOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Hair
              <select
                value={avatar.hairColor}
                onChange={(e) =>
                  setAvatar({ ...avatar, hairColor: e.target.value })
                }
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950"
              >
                {hairColorOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Eye color
              <select
                value={avatar.eyeColor}
                onChange={(e) =>
                  setAvatar({ ...avatar, eyeColor: e.target.value })
                }
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950"
              >
                {eyeColorOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Shirt
              <select
                value={avatar.shirtColor}
                onChange={(e) =>
                  setAvatar({ ...avatar, shirtColor: e.target.value })
                }
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950"
              >
                {shirtColorOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Mouth color
              <select
                value={avatar.mouthColor}
                onChange={(e) =>
                  setAvatar({ ...avatar, mouthColor: e.target.value })
                }
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950"
              >
                {mouthColorOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(avatarShapeOptions).map(([key, opts]) => (
              <label
                key={key}
                className="grid gap-2 text-sm font-medium text-slate-800"
              >
                {toLabel(key)}
                <select
                  value={(avatar as any)[key]}
                  onChange={(e) =>
                    setAvatar({ ...(avatar as any), [key]: e.target.value })
                  }
                  className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950"
                >
                  {(opts as readonly string[]).map((o) => (
                    <option key={o} value={o}>
                      {toLabel(o)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-amber-500 text-black px-6 py-2 font-medium disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {status && <div className="text-sm text-slate-700">{status}</div>}
        </div>
      </div>

      <div className="grid gap-6">
        <AvatarPreview avatar={avatar} name={"Lawrence"} />
      </div>
    </div>
  );
}

export default AvatarEditor;
