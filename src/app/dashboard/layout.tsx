"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const THEMES = [
  { name: "Orange", primary: "#f97316", secondary: "#ea580c" },
  { name: "Blue", primary: "#3b82f6", secondary: "#2563eb" },
  { name: "Green", primary: "#22c55e", secondary: "#16a34a" },
  { name: "Purple", primary: "#a855f7", secondary: "#9333ea" },
  { name: "Rose", primary: "#f43f5e", secondary: "#e11d48" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editPass, setEditPass] = useState("")
  const [profileMsg, setProfileMsg] = useState("")
  const [showTheme, setShowTheme] = useState(false)
  const [showHeaderTheme, setShowHeaderTheme] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("theme") || "Orange"
    return "Orange"
  })
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("dark") === "true"
    return false
  })

  useEffect(() => {
    const t = THEMES.find(t => t.name === theme)
    if (t) {
      document.documentElement.style.setProperty("--theme-primary", t.primary)
      document.documentElement.style.setProperty("--theme-secondary", t.secondary)
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem("dark", dark.toString())
    if (dark) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [dark])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/"); return }
    try {
      const u = JSON.parse(atob(token))
      setUser(u)
      if (u.role === "teacher") {
        const adminPaths = ["/dashboard/users", "/dashboard/payments"]
        if (adminPaths.includes(pathname)) router.push("/dashboard")
      }
    } catch { router.push("/") }
  }, [])

  function changeTheme(name: string) {
    setTheme(name); localStorage.setItem("theme", name); setShowTheme(false); setShowHeaderTheme(false)
  }

  async function saveProfile() {
    if (!user) return
    const payload: any = { id: user.id, login: user.login }
    if (editName) payload.name = editName
    else payload.name = user.name
    payload.phone = editPhone || user.phone || ""
    if (editPass) payload.password = editPass
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updated = await res.json()
      const newToken = Buffer.from(JSON.stringify(updated)).toString("base64")
      localStorage.setItem("token", newToken)
      setUser(updated)
      setEditName(""); setEditPhone(""); setEditPass("")
      setProfileMsg("Profil yangilandi")
    } else { const d = await res.json(); setProfileMsg(d.error || "Xatolik") }
    setTimeout(() => setProfileMsg(""), 4000)
  }

  function logout() { localStorage.removeItem("token"); router.push("/") }

  const isAdmin = user?.role === "admin"
  const isTeacher = user?.role === "teacher"

  const allLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "fa-chart-simple", show: true },
    { href: "/dashboard/groups", label: "Guruhlar", icon: "fa-users", show: true },
    { href: "/dashboard/students", label: "O'quvchilar", icon: "fa-user-graduate", show: true },
    { href: "/dashboard/attendance", label: "Davomat", icon: "fa-check-circle", show: true },
    { href: "/dashboard/lessons", label: "Darslar", icon: "fa-book", show: true },
    { href: "/dashboard/payments", label: "To'lovlar", icon: "fa-credit-card", show: isAdmin },
    { href: "/dashboard/users", label: "Foydalanuvchilar", icon: "fa-user-shield", show: isAdmin },
  ]
  const links = allLinks.filter(l => l.show)

  return (
    <div className={`flex h-screen ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col p-6 text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }}>
            <i className="fas fa-graduation-cap text-white text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Akademiya</h2>
            <p className="text-xs" style={{ color: "var(--theme-primary)" }}>
              {isAdmin ? "Admin panel" : user?.name || ""} {user?.login === "sardor" || user?.login === "shoxali" ? "• Arab tili" : user?.login === "gayrat" ? "• Ingliz tili" : ""}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${active ? "font-semibold" : "text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1"}`}
                style={active ? { background: `${THEMES.find(t => t.name === theme)?.primary}33`, color: THEMES.find(t => t.name === theme)?.primary } : {}}>
                <i className={`fas ${l.icon} w-5 text-center`} /> {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Theme */}
        <div className="relative mb-2">
          <button onClick={() => setShowTheme(!showTheme)}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-xs text-gray-400 hover:bg-white/5 transition cursor-pointer">
            <i className="fas fa-palette" /> Rang
            <span className="ml-auto w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }} />
          </button>
          {showTheme && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-800 rounded-xl p-2 animate-slideIn shadow-xl border border-gray-700 z-50">
              <div className="flex gap-1.5 justify-center">
                {THEMES.map(t => (
                  <button key={t.name} onClick={() => changeTheme(t.name)}
                    className={`w-8 h-8 rounded-full transition-all cursor-pointer ${theme === t.name ? "ring-2 ring-white scale-110" : "hover:scale-110"}`}
                    style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}
                    title={t.name} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="mb-3 p-3 rounded-xl bg-white/5">
          <p className="text-sm text-gray-300 font-medium"><i className="fas fa-user-circle mr-1.5" />{user?.name || "Admin"}</p>
          <p className="text-xs text-gray-500 mb-2">{user?.login || ""} {isTeacher && "(o'qituvchi)"}</p>
          <button onClick={() => { setShowProfile(!showProfile); setEditName(""); setEditPhone(""); setEditPass(""); setProfileMsg("") }} className="text-xs transition cursor-pointer" style={{ color: "var(--theme-primary)" }}>
            <i className="fas fa-pen-to-square mr-1" /> Tahrirlash
          </button>
          {showProfile && (
            <div className="mt-2 animate-slideIn space-y-2">
              <input value={editName} onChange={e => setEditName(e.target.value)} placeholder={user?.name || "Ism"}
                className="w-full px-3 py-1.5 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none" />
              <input value={editPhone} onChange={e => { const v = e.target.value; if (!v.startsWith("+998")) setEditPhone("+998" + v.replace(/[^0-9]/g, "").slice(0, 9)); else setEditPhone("+" + v.replace(/[^0-9]/g, "").slice(0, 12)) }} placeholder={user?.phone || "+998"}
                className="w-full px-3 py-1.5 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none" />
              <input type="password" value={editPass} onChange={e => setEditPass(e.target.value)} placeholder="Yangi parol (bo'sh qoldirsa o'zgarmaydi)"
                className="w-full px-3 py-1.5 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none" />
              <button onClick={saveProfile} className="w-full py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer flex items-center justify-center gap-1"
                style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }}>
                <i className="fas fa-check" /> Saqlash
              </button>
              {profileMsg && <p className={"text-xs mt-1 " + (profileMsg === "Profil yangilandi" ? "text-green-400" : "text-red-400")}><i className="fas fa-check-circle mr-1" />{profileMsg}</p>}
            </div>
          )}
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-sm transition-all cursor-pointer">
          <i className="fas fa-sign-out-alt w-5 text-center" /> Chiqish
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Top header bar */}
        <div className={`sticky top-0 z-30 border-b ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className={`lg:hidden text-xl cursor-pointer ${dark ? "text-gray-300" : "text-gray-700"}`}>
                <i className="fas fa-bars" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs"
                  style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }}>
                  <i className="fas fa-graduation-cap" />
                </div>
                <span className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Akademiya</span>
                <span className={`text-xs ml-2 hidden sm:inline ${dark ? "text-gray-400" : "text-gray-400"}`}>
                  {user?.name} {user?.role === "teacher" ? `(${user?.login === "sardor" || user?.login === "shoxali" ? "Arab tili" : user?.login === "gayrat" ? "Ingliz tili" : ""})` : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Theme picker */}
              <div className="relative">
                <button onClick={() => setShowHeaderTheme(!showHeaderTheme)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${dark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"}`}
                  title="Rang">
                  <i className="fas fa-palette" />
                </button>
                {showHeaderTheme && (
                  <div className={`absolute right-0 top-full mt-1 rounded-xl p-2 animate-slideIn shadow-xl border z-50 ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className="flex gap-1.5">
                      {THEMES.map(t => (
                        <button key={t.name} onClick={() => changeTheme(t.name)}
                          className={`w-7 h-7 rounded-full transition-all cursor-pointer ${theme === t.name ? "ring-2 ring-white scale-110" : "hover:scale-110"}`}
                          style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}
                          title={t.name} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Dark mode toggle */}
              <button onClick={() => setDark(!dark)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${dark ? "hover:bg-gray-700 text-yellow-400" : "hover:bg-gray-100 text-gray-500"}`}
                title={dark ? "Kun rejimi" : "Tun rejimi"}>
                <i className={`fas ${dark ? "fa-sun" : "fa-moon"}`} />
              </button>
            </div>
          </div>
        </div>
        <div className={`p-4 lg:p-8 ${dark ? "text-gray-200" : ""}`}>{children}</div>
      </main>
    </div>
  )
}