"use client"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function getTokenUser(): any {
  try {
    const token = getToken()
    if (!token) return null
    const payloadB64 = token.split(".")[0]
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function authHeaders(contentType = true): Record<string, string> {
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (contentType) headers["Content-Type"] = "application/json"
  return headers
}
