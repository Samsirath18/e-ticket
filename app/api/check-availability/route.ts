import { NextResponse } from "next/server";
import { isColor, isGroup } from "@/src/lib/ticket-input";
import { checkAvailability } from "@/src/services/event.service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ available: false, reason: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";
    const color = typeof body.color === "string" ? body.color.trim() : "";
    const group = typeof body.group === "string" ? body.group.trim() : "";

    if (!eventId || !isColor(color) || !isGroup(group)) {
      return NextResponse.json({ available: false, reason: "INVALID_PAYLOAD" }, { status: 400 });
    }

    const result = await checkAvailability(eventId, color, group);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Availability check failed:", error);
    return NextResponse.json(
      { available: false, reason: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
