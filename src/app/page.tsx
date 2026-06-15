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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-orange-500/10 -top-32 -right-32 animate-float" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-600/10 -bottom-24 -left-24 animate-[float_8s_ease-in-out_infinite_reverse]" />
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md z-10 animate-scaleIn border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float">
            <i className="fas fa-language" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EduPlatform</h1>
          <p className="text-gray-400 text-sm mt-1">Arab tili o'quv markazi</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center mb-4 animate-bounceIn border border-red-100">
          <i className="fas fa-exclamation-circle mr-1" />{error}</div>}
        <div className="relative mb-4">
          <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Login" value={login} onChange={e => setLogin(e.target.value)}
            className="input-field pl-10" required />
        </div>
        <div className="relative mb-6">
          <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="password" placeholder="Parol" value={password} onChange={e => setPassword(e.target.value)}
            className="input-field pl-10" required />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2 btn-orange">
          {loading ? <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <i className="fas fa-arrow-right" />}
          Kirish
        </button>
        <p className="text-center text-gray-400 text-xs mt-6">Arab tili o'quv markazi</p>
      </form>
    </div>
  )
}