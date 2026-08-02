import { getUserByLogin } from "@/lib/db"
import { signToken } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json()

    const user = await getUserByLogin(login)
    if (!user) {
      return Response.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
    }

    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
      return Response.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
    }

    const { password: _, ...userData } = user
    userData.role = user.role === "admin" ? "admin" : "teacher"
    const token = signToken(userData)
    return Response.json({ token, user: userData })
  } catch {
    return Response.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
  }
}
