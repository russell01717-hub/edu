import { setAttendance, getStudent, getLessons, getGroups, createPayment } from "@/lib/db"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const { attendances } = await req.json()

  for (const a of attendances) {
    await setAttendance(a.studentId, a.lessonId, a.status)
  }

  return Response.json({ ok: true })
}
