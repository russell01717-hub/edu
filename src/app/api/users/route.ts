import { getUsers, createUser, updateUser, deleteUser, getUserByLogin, getUserById } from "@/lib/db"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json(await getUsers())
}

export async function POST(req: NextRequest) {
  const { name, login, password, role } = await req.json()
  const user = await createUser(name, login, password, role || "admin")
  if (!user) return Response.json({ error: "Bu login band" }, { status: 400 })
  return Response.json(user)
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, login, password, phone } = await req.json()
    let user = await updateUser(id, name, password, phone)
    if (!user && login) {
      const found = await getUserByLogin(login)
      if (found) user = await updateUser(found.id, name, password, phone)
    }
    if (!user) return Response.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 })
    return Response.json(user)
  } catch (e: any) {
    return Response.json({ error: e.message || "Server xatolik" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  const ok = await deleteUser(id)
  if (!ok) return Response.json({ error: "Admin o'chirilmaydi" }, { status: 400 })
  return Response.json({ ok: true })
}