import { NextResponse } from "next/server";
import { createMessage, listPublicMessages } from "@/lib/supabaseServer";
import { getValidatedMessageSubmission } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const messages = await listPublicMessages();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load messages.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submission = getValidatedMessageSubmission(body);
    const created = await createMessage(submission);

    return NextResponse.json({
      message: created,
      status: created.approved
        ? "Message submitted and approved."
        : "Message submitted successfully. It will appear after approval.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid submission." },
      { status: 400 },
    );
  }
}
