import { NextResponse } from "next/server";
import { approveMessage } from "@/lib/supabaseServer";
import { parseAdminSecret } from "@/lib/validation";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  return (
    parseAdminSecret(request.headers.get("x-admin-secret")) ===
    parseAdminSecret(process.env.ADMIN_SECRET ?? null)
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const message = await approveMessage(id);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to approve message.",
      },
      { status: 500 },
    );
  }
}
