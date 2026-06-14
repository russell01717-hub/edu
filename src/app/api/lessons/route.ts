import { getLessons, createLesson } from "@/lib/db"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json(await getLessons())
}

export async function POST(req: NextRequest) {
  const { groupId, date, topic } = await req.json()
  const lesson = await createLesson(groupId, date, topic || "")
  return Response.json({ id: lesson.id })
}
