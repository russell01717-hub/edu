import { getUserByLogin } from "@/lib/db"
import bcrypt from "bcryptjs"

const HARDCODED_USERS = [
  { name: "Admin", login: "admin", password: "admin123", role: "admin" },
  { name: "Sardor", login: "sardor", password: "4444", role: "teacher" },
  { name: "G'ayrat", login: "gayrat", password: "4444", role: "teacher" },
  { name: "Shoxali", login: "shoxali", password: "4444", role: "teacher" },
]

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json()

    // 1) Try database / JSON backend
    let user: any
    try { user = await getUserByLogin(login) } catch { user = null }
    if (user) {
      const match = bcrypt.compareSync(password, user.password)
      if (match) {
        const { password: _, ...userData } = user
        const token = Buffer.from(JSON.stringify(userData)).toString("base64")
        return Response.json({ token, user: userData })
      }
    }

    // 2) Fallback: hardcoded check (never fails)
    const HC_IDS: Record<string, number> = { admin: 1, sardor: 2, gayrat: 3, shoxali: 4 }
    const hc = HARDCODED_USERS.find(u => u.login === login && u.password === password)
    if (hc) {
      const userData = { id: HC_IDS[hc.login] || 0, name: hc.name, login: hc.login, role: hc.role }
      const token = Buffer.from(JSON.stringify(userData)).toString("base64")
      return Response.json({ token, user: userData })
    }

    return Response.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
  } catch {
    return Response.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
  }
}
