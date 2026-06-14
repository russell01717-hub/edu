import { getStudents, createStudent, deleteStudent } from "@/lib/db"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const groupId = req.nextUrl.searchParams.get("groupId")
  return Response.json(await getStudents(groupId ? parseInt(groupId) : undefined))
}

export async function POST(req: NextRequest) {
  const { name, phone, groupId } = await req.json()
  await createStudent(name, phone || "", groupId)
  return Response.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  await deleteStudent(id)
  return Response.json({ ok: true })
}
