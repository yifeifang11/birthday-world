import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const given = String(body?.password ?? "");

    const expected = process.env.EXPLORE_PASSWORD ?? "";

    if (!expected) {
      return NextResponse.json(
        { ok: false, error: "Explore password not configured" },
        { status: 500 },
      );
    }

    if (given === expected) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "Invalid password" },
      { status: 401 },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Bad request" },
      { status: 400 },
    );
  }
}
