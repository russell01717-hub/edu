import { getGroups, createGroup, deleteGroup } from "@/lib/db"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json(await getGroups())
}

export async function POST(req: NextRequest) {
  const { name, description, pricePerLesson } = await req.json()
  await createGroup(name, description || "", pricePerLesson || 0)
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  await deleteGroup(id)
  return Response.json({ ok: true })
}
