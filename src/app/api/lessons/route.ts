import { getLessons, createLesson, deleteLesson, getGroups } from "@/lib/db"
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  let lessons = await getLessons()
  if (authUser.role === "teacher") {
    const groups = await getGroups()
    const teacherGroupIds = groups.filter((g: any) => g.teacherId === authUser.id).map((g: any) => g.id)
    lessons = lessons.filter((l: any) => teacherGroupIds.includes(l.groupId))
  }
  return Response.json(lessons)
}

export async function POST(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const { groupId, date, topic } = await req.json()
  if (authUser.role === "teacher") {
    const groups = await getGroups()
    const g = groups.find((x: any) => x.id === groupId)
    if (!g || g.teacherId !== authUser.id) return forbidden()
  }
  const lesson = await createLesson(groupId, date, topic || "")
  return Response.json({ id: lesson.id })
}

export async function DELETE(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  if (authUser.role === "teacher") {
    const lessons = await getLessons()
    const l = lessons.find((x: any) => x.id === id)
    if (!l) return Response.json({ error: "Topilmadi" }, { status: 404 })
    const groups = await getGroups()
    const g = groups.find((x: any) => x.id === l.groupId)
    if (!g || g.teacherId !== authUser.id) return forbidden()
  }
  await deleteLesson(id)
  return Response.json({ ok: true })
}
