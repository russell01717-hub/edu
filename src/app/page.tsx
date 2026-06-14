"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">EduPlatform</h1>
        <p className="text-center text-gray-500 mb-6">Arab tili o'quv markazi</p>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={e => setLogin(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Kirish
        </button>
      </form>
    </div>
  )
}
