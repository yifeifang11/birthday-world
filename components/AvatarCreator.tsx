"use client";

import { useState, type FormEvent } from "react";
import { AvatarPreview } from "./AvatarPreview";
import {
  avatarShapeOptions,
  defaultAvatarConfig,
  hairColorOptions,
  shirtColorOptions,
  skinToneOptions,
  toLabel,
} from "@/lib/avatarOptions";
import type { AvatarConfig } from "@/lib/types";

const optionFields: Array<{
  key: keyof AvatarConfig;
  label: string;
  options: readonly string[];
}> = [
  {
    key: "headShape",
    label: "Head shape",
    options: avatarShapeOptions.headShape,
  },
  {
    key: "torsoShape",
    label: "Torso shape",
    options: avatarShapeOptions.torsoShape,
  },
  {
    key: "hairStyle",
    label: "Hair style",
    options: avatarShapeOptions.hairStyle,
  },
  { key: "eyes", label: "Eyes", options: avatarShapeOptions.eyes },
  { key: "mouth", label: "Mouth", options: avatarShapeOptions.mouth },
  {
    key: "accessory",
    label: "Accessory",
    options: avatarShapeOptions.accessory,
  },
];

export function AvatarCreator() {
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState<AvatarConfig>(defaultAvatarConfig);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, message, avatar }),
      });

      const payload = (await response.json()) as {
        error?: string;
        status?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to submit message.");
      }

      setSuccess(
        payload.status ??
          "Message submitted successfully. It will appear after approval.",
      );
      setDisplayName("");
      setMessage("");
      setAvatar(defaultAvatarConfig);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleSubmit}
        className="panel-strong rounded-[2rem] p-6 md:p-8"
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Create
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            Leave a floating message
          </h2>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Build a simple avatar, write a short note, and submit it for the
            recipient&apos;s world.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Display name
            <input
              className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400"
              value={displayName}
              maxLength={32}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Maya"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Message
            <textarea
              className="min-h-32 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400"
              value={message}
              maxLength={500}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Happy birthday. I hope this year is bright and calm."
              required
            />
          </label>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Skin
              <select
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400"
                value={avatar.skinColor}
                onChange={(event) =>
                  setAvatar({ ...avatar, skinColor: event.target.value })
                }
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
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400"
                value={avatar.hairColor}
                onChange={(event) =>
                  setAvatar({ ...avatar, hairColor: event.target.value })
                }
              >
                {hairColorOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Shirt
              <select
                className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400"
                value={avatar.shirtColor}
                onChange={(event) =>
                  setAvatar({ ...avatar, shirtColor: event.target.value })
                }
              >
                {shirtColorOptions.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {optionFields.map((field) => (
              <label
                key={field.key}
                className="grid gap-2 text-sm font-medium text-slate-800"
              >
                {field.label}
                <select
                  className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-slate-950 outline-none transition focus:border-slate-400"
                  value={avatar[field.key]}
                  onChange={(event) =>
                    setAvatar({
                      ...avatar,
                      [field.key]: event.target
                        .value as AvatarConfig[typeof field.key],
                    })
                  }
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {toLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit message"}
          </button>
          <p className="text-sm text-slate-500">
            Name max 32 chars, message max 500 chars.
          </p>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </p>
        ) : null}
      </form>

      <div className="grid gap-6">
        <AvatarPreview avatar={avatar} name={displayName || "Preview"} />

        <div className="panel rounded-[1.8rem] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Preview notes
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-7 text-slate-700">
            <li>Avatar geometry stays simple and low-poly.</li>
            <li>The world scatters approved avatars across the map.</li>
            <li>Memory sites remain static in code for V1.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
