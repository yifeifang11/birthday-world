import { NextResponse } from "next/server";
import { deleteMessage } from "@/lib/supabaseServer";
import { parseAdminSecret } from "@/lib/validation";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  return (
    parseAdminSecret(request.headers.get("x-admin-secret")) ===
    parseAdminSecret(process.env.ADMIN_SECRET ?? null)
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteMessage(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete message.",
      },
      { status: 500 },
    );
  }
}
