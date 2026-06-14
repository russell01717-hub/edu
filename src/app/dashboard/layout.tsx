"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [newPass, setNewPass] = useState("")
  const [passMsg, setPassMsg] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/"); return }
    try { setUser(JSON.parse(atob(token))) } catch { router.push("/") }
  }, [])

  async function changePassword() {
    if (!newPass || !user) return
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, name: user.name, password: newPass }),
    })
    if (res.ok) {
      setPassMsg("Parol o'zgartirildi ✅"); setNewPass("")
    } else {
      setPassMsg("Xatolik ❌")
    }
    setTimeout(() => setPassMsg(""), 3000)
  }

  function logout() { localStorage.removeItem("token"); router.push("/") }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/groups", label: "Guruhlar", icon: "👥" },
    { href: "/dashboard/students", label: "O'quvchilar", icon: "🎓" },
    { href: "/dashboard/attendance", label: "Davomat", icon: "✅" },
    { href: "/dashboard/payments", label: "To'lovlar", icon: "💳" },
    { href: "/dashboard/lessons", label: "Darslar", icon: "📖" },
    { href: "/dashboard/users", label: "Foydalanuvchilar", icon: "👤" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col p-6 text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold">E</div>
          <div>
            <h2 className="text-lg font-bold">EduPlatform</h2>
            <p className="text-orange-300 text-xs">Arab tili markazi</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-orange-500/20 text-orange-300 font-semibold" : "text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1"}`}>
                <span>{l.icon}</span> {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Profile / Change Password */}
        <div className="mb-3 p-3 rounded-xl bg-white/5">
          <p className="text-sm text-gray-300 font-medium">{user?.name || "Admin"}</p>
          <p className="text-xs text-gray-500 mb-2">{user?.login || ""}</p>
          <button onClick={() => setShowProfile(!showProfile)} className="text-xs text-orange-400 hover:text-orange-300 transition cursor-pointer">🔑 Parolni o'zgartirish</button>
          {showProfile && (
            <div className="mt-2 animate-slideIn">
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Yangi parol"
                className="w-full px-3 py-1.5 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 mb-2" />
              <button onClick={changePassword} className="w-full py-1.5 rounded-lg text-xs font-semibold text-white btn-orange cursor-pointer">Saqlash</button>
              {passMsg && <p className="text-xs text-green-400 mt-1">{passMsg}</p>}
            </div>
          )}
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-sm transition-all cursor-pointer">
          🚪 Chiqish
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl cursor-pointer">☰</button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">E</div>
            <span className="font-semibold text-sm">EduPlatform</span>
          </div>
          <div className="w-8" />
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
