import { NextResponse } from "next/server"
import { checkAvailability } from "../../../services/event.service"


export async function POST(req: Request) {
  const { eventId, color, group } = await req.json()

  const result = await checkAvailability(eventId, color, group)

  return NextResponse.json(result)
}