import { getStats, getGroups, getStudents, getLessons, getPayments } from "@/lib/db"
import { getUserFromRequest, unauthorized } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  if (authUser.role === "teacher") {
    const groups = await getGroups()
    const teacherGroups = groups.filter((g: any) => g.teacherId === authUser.id)
    const groupIds = teacherGroups.map((g: any) => g.id)
    const allStudents = await getStudents()
    const allLessons = await getLessons()
    const allPayments = await getPayments()

    const teacherStudents = allStudents.filter((s: any) => groupIds.includes(s.groupId))
    const teacherLessons = allLessons.filter((l: any) => groupIds.includes(l.groupId))
    const lessonIds = teacherLessons.map((l: any) => l.id)
    const teacherPayments = allPayments.filter((p: any) => lessonIds.includes(p.lessonId) || teacherStudents.some((s: any) => s.id === p.studentId))

    const totalPayments = teacherPayments.filter((p: any) => p.type === "income").reduce((sum: number, p: any) => sum + p.amount, 0)

    return Response.json({
      students: teacherStudents.length,
      groups: teacherGroups.length,
      lessons: teacherLessons.length,
      totalPayments,
      recentAttendance: [],
    })
  }

  const data = await getStats()
  return Response.json(data)
}
