import { NextResponse } from "next/server";
import { listAdminMessages } from "@/lib/supabaseServer";
import { parseAdminSecret } from "@/lib/validation";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  return (
    parseAdminSecret(request.headers.get("x-admin-secret")) ===
    parseAdminSecret(process.env.ADMIN_SECRET ?? null)
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const messages = await listAdminMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load admin messages.",
      },
      { status: 500 },
    );
  }
}
