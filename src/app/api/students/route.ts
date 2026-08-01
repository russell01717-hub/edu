import { getStudents, createStudent, deleteStudent, getGroups, getStudent } from "@/lib/db"
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const groupId = req.nextUrl.searchParams.get("groupId")
  let students = await getStudents(groupId ? parseInt(groupId) : undefined)
  if (authUser.role === "teacher") {
    const groups = await getGroups()
    const teacherGroupIds = groups.filter((g: any) => g.teacherId === authUser.id).map((g: any) => g.id)
    students = students.filter((s: any) => teacherGroupIds.includes(s.groupId))
  }
  return Response.json(students)
}

export async function POST(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const { name, phone, groupId, startDate } = await req.json()
  if (authUser.role === "teacher") {
    const g = (await getGroups()).find((x: any) => x.id === groupId)
    if (!g || g.teacherId !== authUser.id) return forbidden()
  }
  await createStudent(name, phone || "", groupId, startDate || "")
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  if (authUser.role === "teacher") {
    const s = await getStudent(id)
    if (!s) return Response.json({ error: "Topilmadi" }, { status: 404 })
    const groups = await getGroups()
    const g = groups.find((x: any) => x.id === s.groupId)
    if (!g || g.teacherId !== authUser.id) return forbidden()
  }
  await deleteStudent(id)
  return Response.json({ ok: true })
}
