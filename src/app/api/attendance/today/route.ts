import { findLessonByGroupAndDate, createLesson, setAttendance, getStudent, getGroups } from "@/lib/db"
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const { studentId, status } = await req.json()
  const student = await getStudent(studentId)
  if (!student) return Response.json({ error: "Student not found" }, { status: 404 })

  if (authUser.role === "teacher") {
    const groups = await getGroups()
    const g = groups.find((x: any) => x.id === student.groupId)
    if (!g || g.teacherId !== authUser.id) return forbidden()
  }

  const today = new Date().toISOString().split("T")[0]
  let lesson = await findLessonByGroupAndDate(student.groupId, today)

  if (!lesson) {
    lesson = await createLesson(student.groupId, today, "Kunlik dars")
  }

  await setAttendance(studentId, lesson.id, status)

  return Response.json({ ok: true, lessonId: lesson.id, status })
}
