import crypto from "crypto"

const SECRET = process.env.AUTH_SECRET || "akademiya-dev-secret-change-me"

export interface AuthUser {
  id: number
  name: string
  login: string
  role: "admin" | "teacher"
  phone?: string
  [key: string]: any
}

export function signToken(user: AuthUser): string {
  const payload = { ...user, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  const payloadStr = JSON.stringify(payload)
  const payloadB64 = Buffer.from(payloadStr).toString("base64url")
  const sig = crypto.createHmac("sha256", SECRET).update(payloadStr).digest("base64url")
  return `${payloadB64}.${sig}`
}

export function verifyToken(token: string | null | undefined): AuthUser | null {
  if (!token) return null
  const [payloadB64, sig] = token.split(".")
  if (!payloadB64 || !sig) return null
  let payloadStr: string
  try { payloadStr = Buffer.from(payloadB64, "base64url").toString("utf-8") } catch { return null }
  const expected = crypto.createHmac("sha256", SECRET).update(payloadStr).digest("base64url")
  if (sig !== expected) return null
  try {
    const payload = JSON.parse(payloadStr)
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch { return null }
}

export function getUserFromRequest(req: Request): AuthUser | null {
  const auth = req.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) return null
  return verifyToken(auth.slice(7))
}

export function unauthorized() {
  return Response.json({ error: "Avtorizatsiya talab qilinadi" }, { status: 401 })
}

export function forbidden() {
  return Response.json({ error: "Ruxsat yo'q" }, { status: 403 })
}
