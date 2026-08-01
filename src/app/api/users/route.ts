import { getUsers, createUser, updateUser, deleteUser, getUserByLogin, getUserById } from "@/lib/db"
import { getUserFromRequest, unauthorized, forbidden, signToken } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return unauthorized()
  if (user.role !== "admin") return forbidden()
  return Response.json(await getUsers())
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return unauthorized()
  if (user.role !== "admin") return forbidden()
  const { name, login, password, role } = await req.json()
  const u = await createUser(name, login, password, role || "admin")
  if (!u) return Response.json({ error: "Bu login band" }, { status: 400 })
  return Response.json(u)
}

export async function PUT(req: NextRequest) {
  const authUser = getUserFromRequest(req)
  if (!authUser) return unauthorized()
  try {
    const { id, name, login, password, phone } = await req.json()
    let target = null
    if (id) {
      const found = await getUserById(id)
      if (found) target = found
    } else if (login) {
      target = await getUserByLogin(login)
    }
    if (!target) return Response.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 })
    if (authUser.role !== "admin" && target.id !== authUser.id) return forbidden()
    const user = await updateUser(target.id, name ?? target.name, password, phone ?? target.phone)
    if (!user) return Response.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 })
    const token = user.id === authUser.id ? signToken(user) : undefined
    return Response.json({ ...user, token })
  } catch (e: any) {
    return Response.json({ error: e.message || "Server xatolik" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return unauthorized()
  if (user.role !== "admin") return forbidden()
  const id = parseInt(req.nextUrl.searchParams.get("id")!)
  const ok = await deleteUser(id)
  if (!ok) return Response.json({ error: "Admin o'chirilmaydi" }, { status: 400 })
  return Response.json({ ok: true })
}
