import { NextResponse } from "next/server";
import {
  getAvatarSettings,
  saveAvatarSettings,
} from "../../../lib/supabaseServer";
import { defaultAvatarConfig } from "../../../lib/avatarOptions";

export async function GET() {
  try {
    const settings = await getAvatarSettings();

    if (!settings) {
      // initialize with defaults
      const saved = await saveAvatarSettings(defaultAvatarConfig);
      return NextResponse.json({ ok: true, settings: saved });
    }

    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Failed to load settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = body?.settings ?? null;

    if (!settings) {
      return NextResponse.json(
        { ok: false, error: "Missing settings" },
        { status: 400 },
      );
    }

    const saved = await saveAvatarSettings(settings);
    return NextResponse.json({ ok: true, settings: saved });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
