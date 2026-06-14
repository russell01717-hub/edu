import { getGroups, getGroup, createGroup, updateGroup, deleteGroup } from "@/lib/db"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (id) return Response.json(await getGroup(parseInt(id)))
  return Response.json(await getGroups())
}

export async function POST(req: NextRequest) {
  const { name, description, pricePerLesson, days } = await req.json()
  await createGroup(name, description || "", pricePerLesson || 0, days || "")
  return Response.json({ ok: true })
}

export async function PUT(req: NextRequest) {
  const { id, name, description, pricePerLesson, days } = await req.json()
  await updateGroup(id, name, description || "", pricePerLesson || 0, days)
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  await deleteGroup(id)
  return Response.json({ ok: true })
}
