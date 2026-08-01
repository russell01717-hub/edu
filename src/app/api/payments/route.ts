import { getPayments, createPayment } from "@/lib/db"
import { getUserFromRequest, unauthorized, forbidden } from "@/lib/auth"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return unauthorized()
  if (user.role !== "admin") return forbidden()
  return Response.json(await getPayments())
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return unauthorized()
  if (user.role !== "admin") return forbidden()

  const { studentId, amount, note, date } = await req.json()
  await createPayment(studentId, amount, "income", note || "", date)
  return Response.json({ ok: true })
}
