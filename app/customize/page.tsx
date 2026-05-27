"use client";

import React, { useEffect, useState } from "react";
import FullscreenAvatarViewer from "@/components/FullscreenAvatarViewer";
import type { AvatarConfig } from "@/lib/types";
import { defaultAvatarConfig } from "@/lib/avatarOptions";
import { useRouter } from "next/navigation";

export default function CustomizePage() {
  const [settings, setSettings] = useState<AvatarConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/avatar-settings");
        const json = await res.json();
        if (!mounted) return;
        if (res.ok && json.ok) {
          setSettings(json.settings ?? json);
        }
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const avatar = settings ?? defaultAvatarConfig;
  function setAvatar(s: AvatarConfig) {
    setSettings(s);
  }

  if (loading) return <div>Loading…</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <FullscreenAvatarViewer
        avatar={avatar}
        setAvatar={setAvatar}
        focusedKey="hairStyle"
        onSave={async () => {
          await fetch("/api/avatar-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ settings: avatar }),
          });
          setSettings(avatar);
        }}
        onContinue={() => router.push("/world")}
      />
    </div>
  );
}
