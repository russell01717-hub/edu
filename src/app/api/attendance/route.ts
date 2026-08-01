import { setAttendance, getMonthAttendances, getGroups, getLessons } from "@/lib/db"
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const month = req.nextUrl.searchParams.get("month")
  if (!month) return Response.json([])
  let atts = await getMonthAttendances(month)
  if (authUser.role === "teacher") {
    const groups = await getGroups()
    const teacherGroupIds = groups.filter((g: any) => g.teacherId === authUser.id).map((g: any) => g.id)
    const lessons = await getLessons()
    const teacherLessonIds = lessons.filter((l: any) => teacherGroupIds.includes(l.groupId)).map((l: any) => l.id)
    atts = atts.filter((a: any) => teacherLessonIds.includes(a.lessonId))
  }
  return Response.json(atts)
}

export async function POST(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const { attendances } = await req.json()

  let allowedLessonIds: number[] | null = null
  if (authUser.role === "teacher") {
    const groups = await getGroups()
    const teacherGroupIds = groups.filter((g: any) => g.teacherId === authUser.id).map((g: any) => g.id)
    const lessons = await getLessons()
    allowedLessonIds = lessons.filter((l: any) => teacherGroupIds.includes(l.groupId)).map((l: any) => l.id)
  }

  for (const a of attendances) {
    if (allowedLessonIds && !allowedLessonIds.includes(a.lessonId)) continue
    await setAttendance(a.studentId, a.lessonId, a.status)
  }

  return Response.json({ ok: true })
}
