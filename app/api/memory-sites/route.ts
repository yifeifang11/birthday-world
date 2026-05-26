import { NextResponse } from "next/server";
import { getStaticMemorySites } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getStaticMemorySites());
}
