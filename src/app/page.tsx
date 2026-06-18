"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const ACCOUNTS = [
  { label: "Admin", login: "admin", pass: "admin123", role: "admin", desc: "Hamma narsani ko'radi" },
  { label: "Sardor", login: "sardor", pass: "4444", role: "teacher", desc: "Arab tili o'qituvchisi" },
  { label: "G'ayrat", login: "gayrat", pass: "4444", role: "teacher", desc: "Ingliz tili o'qituvchisi" },
  { label: "Shoxali", login: "shoxali", pass: "4444", role: "teacher", desc: "Arab tili o'qituvchisi" },
]

export default function LoginPage() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!login || !password) { setError("Login va parolni kiriting"); return }
    setError(""); setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { data = {} }
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token)
        router.push("/dashboard")
        return
      }
      setError(data.error || "Login yoki parol noto'g'ri")
    } catch {
      setError("Serverga ulanishda muammo")
    }
    setLoading(false)
  }

  function selectAccount(label: string) {
    setSelected(selected === label ? "" : label)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1200px" }}>
        <div className="absolute top-[15%] left-[10%] w-20 h-20 border-2 border-orange-500/20 rounded-2xl animate-float" style={{ animationDelay: "0s", animationDuration: "6s", transform: "rotateX(45deg) rotateZ(15deg)" }} />
        <div className="absolute top-[60%] right-[12%] w-28 h-28 border-2 border-orange-500/15 rounded-full animate-float" style={{ animationDelay: "1.5s", animationDuration: "8s", transform: "rotateY(30deg)" }} />
        <div className="absolute top-[30%] right-[20%] w-16 h-16 border-2 border-purple-500/20 animate-float" style={{ animationDelay: "3s", animationDuration: "7s", transform: "rotateX(60deg) rotateZ(45deg)" }} />
        <div className="absolute bottom-[20%] left-[15%] w-24 h-24 border border-orange-500/10 rounded-full animate-float" style={{ animationDelay: "2s", animationDuration: "9s" }} />
      </div>

      <div className="w-full max-w-md z-10">
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 animate-scaleIn mb-4 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-28 h-28 opacity-20 pointer-events-none">
            <img src="/login-bg.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-3 overflow-hidden shadow-lg shadow-orange-500/30 animate-float">
              <img src="/login-bg.png" alt="" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Akademiya</h1>
            <p className="text-gray-400 text-sm mt-1">O'quv markazi tizimi</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center mb-4 border border-red-100">
            <i className="fas fa-exclamation-circle mr-1" />{error}
          </div>}

          <div className="relative mb-3">
            <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input type="text" placeholder="Login" value={login} onChange={e => setLogin(e.target.value)}
              className="w-full pt-2.5 pb-2.5 pl-9 pr-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:bg-white focus:shadow-lg transition-all" required />
          </div>
          <div className="relative mb-5">
            <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <input type="password" placeholder="Parol" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full pt-2.5 pb-2.5 pl-9 pr-3 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:bg-white focus:shadow-lg transition-all" required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white cursor-pointer flex items-center justify-center gap-2 btn-primary">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <i className="fas fa-arrow-right" />}
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/30 animate-slideIn">
          <p className="text-center text-xs text-gray-400 mb-3"><i className="fas fa-users mr-1" />Mavjud akkauntlar</p>
          <div className="grid grid-cols-2 gap-2">
            {ACCOUNTS.map(a => {
              const isSel = selected === a.label
              return (
                <div key={a.login} onClick={() => selectAccount(a.label)}
                  className="p-2.5 rounded-xl text-center transition-all cursor-pointer border relative overflow-hidden"
                  style={{
                    background: isSel ? `linear-gradient(135deg, ${a.role === "admin" ? "#f97316" : a.label === "G'ayrat" ? "#3b82f6" : "#f97316"}, ${a.role === "admin" ? "#ea580c" : a.label === "G'ayrat" ? "#2563eb" : "#ea580c"})` : "white",
                    borderColor: isSel ? "transparent" : "#e5e7eb",
                  }}>
                  <p className={`text-sm font-bold ${isSel ? "text-white" : "text-gray-900"}`}>{a.label}</p>
                  <p className={`text-[10px] ${isSel ? "text-white/80" : "text-gray-400"}`}>{a.desc}</p>
                  {!isSel && <div className="absolute inset-0 hover:bg-orange-50 transition-colors" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}