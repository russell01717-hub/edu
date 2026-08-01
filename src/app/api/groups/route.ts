import { getGroups, getGroup, createGroup, updateGroup, deleteGroup } from "@/lib/db"
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const id = req.nextUrl.searchParams.get("id")
  if (id) {
    const g = await getGroup(parseInt(id))
    if (!g) return Response.json(null)
    if (authUser.role === "teacher" && g.teacherId !== authUser.id) return forbidden()
    return Response.json(g)
  }

  let groups = await getGroups()
  if (authUser.role === "teacher") {
    groups = groups.filter((g: any) => g.teacherId === authUser.id)
  }
  return Response.json(groups)
}

export async function POST(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const { name, description, pricePerLesson, monthlyFee, days, subject, teacherId } = await req.json()
  const assigned = authUser.role === "teacher" ? authUser.id : (teacherId || 0)
  if (authUser.role === "teacher" && assigned !== authUser.id) return forbidden()
  await createGroup(name, description || "", pricePerLesson || 0, days || "", subject || "", assigned, monthlyFee ?? 270000)
  return Response.json({ ok: true })
}

export async function PUT(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const { id, name, description, pricePerLesson, monthlyFee, days, subject, teacherId } = await req.json()
  const existing = await getGroup(id)
  if (!existing) return Response.json({ error: "Guruh topilmadi" }, { status: 404 })
  if (authUser.role === "teacher" && existing.teacherId !== authUser.id) return forbidden()

  const assigned = authUser.role === "teacher" ? authUser.id : (teacherId || 0)
  await updateGroup(id, name, description || "", pricePerLesson || 0, days, subject, assigned, monthlyFee ?? 270000)
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()

  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  const existing = await getGroup(id)
  if (!existing) return Response.json({ error: "Guruh topilmadi" }, { status: 404 })
  if (authUser.role === "teacher" && existing.teacherId !== authUser.id) return forbidden()

  await deleteGroup(id)
  return Response.json({ ok: true })
}
