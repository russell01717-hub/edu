"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    })
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem("token", data.token)
      router.push("/dashboard")
    } else {
      const data = await res.json()
      setError(data.error || "Xatolik yuz berdi")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="absolute w-[600px] h-[600px] rounded-full bg-white/5 -top-48 -right-48 animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-white/5 -bottom-24 -left-24 animate-[float_8s_ease-in-out_infinite_reverse]" />
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md z-10 animate-scaleIn">
        <h1 className="text-3xl font-bold text-center mb-1" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EduPlatform</h1>
        <p className="text-center text-gray-400 mb-8 text-sm">Arab tili o'quv markazi</p>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm text-center mb-4 animate-bounceIn">{error}</div>}
        <input type="text" placeholder="Login" value={login} onChange={e => setLogin(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl mb-4 text-sm focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 bg-gray-50 transition-all" required />
        <input type="password" placeholder="Parol" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl mb-6 text-sm focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 bg-gray-50 transition-all" required />
        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          {loading ? <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Kirish"}
        </button>
        <p className="text-center text-gray-400 text-xs mt-6">Admin: <strong>admin</strong> | Parol: <strong>admin123</strong></p>
      </form>
    </div>
  )
}
