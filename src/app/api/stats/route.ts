import { getStats, getGroups, getStudents, getLessons, getPayments } from "@/lib/db"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const teacherId = req.nextUrl.searchParams.get("teacherId")
  const role = req.nextUrl.searchParams.get("role")
  const isTeacher = role === "teacher" && teacherId

  if (isTeacher) {
    const groups = await getGroups()
    const teacherGroups = groups.filter((g: any) => g.teacherId === parseInt(teacherId))
    const groupIds = teacherGroups.map((g: any) => g.id)
    const allStudents = await getStudents()
    const allLessons = await getLessons()
    const allPayments = await getPayments()

    const teacherStudents = allStudents.filter((s: any) => groupIds.includes(s.groupId))
    const teacherLessons = allLessons.filter((l: any) => groupIds.includes(l.groupId))
    const lessonIds = teacherLessons.map((l: any) => l.id)
    const teacherPayments = allPayments.filter((p: any) => lessonIds.includes(p.lessonId) || teacherStudents.some((s: any) => s.id === p.studentId))

    const totalPayments = teacherPayments.filter((p: any) => p.type === "income").reduce((sum: number, p: any) => sum + p.amount, 0)
    const recentAttendance: any[] = []

    return Response.json({
      students: teacherStudents.length,
      groups: teacherGroups.length,
      lessons: teacherLessons.length,
      totalPayments,
      recentAttendance,
    })
  }

  const data = await getStats()
  return Response.json(data)
}