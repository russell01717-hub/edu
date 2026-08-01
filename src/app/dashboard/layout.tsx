"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LiquidNav } from "@/components/LiquidNav"
import { getTokenUser, authHeaders } from "@/lib/auth-client"

const THEMES = [
  { name: "Teal", primary: "#0d9488", secondary: "#0f766e" },
  { name: "Blue", primary: "#3b82f6", secondary: "#2563eb" },
  { name: "Violet", primary: "#8b5cf6", secondary: "#7c3aed" },
  { name: "Emerald", primary: "#10b981", secondary: "#059669" },
  { name: "Rose", primary: "#f43f5e", secondary: "#e11d48" },
]

const LIQUID_PATHS: Record<string, string> = {
  "/dashboard": "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  "/dashboard/groups": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  "/dashboard/students": "M16 11a3 3 0 10-6 0 3 3 0 006 0zm-8.5 8a4.5 4.5 0 019 0M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4",
  "/dashboard/attendance": "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "/dashboard/lessons": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  "/dashboard/payments": "M3 10h18M7 15h3m-6 8h16a2 2 0 002-2V9a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z",
  "/dashboard/users": "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
}

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
    if (typeof window !== "undefined") return localStorage.getItem("theme") || "Teal"
    return "Teal"
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
      const u = getTokenUser()
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
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updated = await res.json()
      if (updated.token) localStorage.setItem("token", updated.token)
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
    <div className="flex h-screen" style={{ background: "var(--bg)" }}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col p-4 text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg, #0b1716 0%, #0e211f 100%)" }}>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }}>
            <i className="fas fa-graduation-cap text-white text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">Akademiya</h2>
            <p className="text-xs" style={{ color: "var(--theme-primary)" }}>
              {isAdmin ? "Admin panel" : user?.name || ""} {user?.login === "sardor" || user?.login === "shoxali" ? "• Arab tili" : user?.login === "gayrat" ? "• Ingliz tili" : ""}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? "font-semibold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                style={active ? { background: `${THEMES.find(t => t.name === theme)?.primary}2e`, color: THEMES.find(t => t.name === theme)?.primary } : {}}>
                <i className={`fas ${l.icon} w-5 text-center text-base`} /> {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Theme */}
        <div className="relative mb-2">
          <button onClick={() => setShowTheme(!showTheme)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-white/5 transition cursor-pointer">
            <i className="fas fa-palette" /> Rang
            <span className="ml-auto w-4 h-4 rounded-full" style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }} />
          </button>
          {showTheme && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-xl p-2 animate-slideIn shadow-xl border border-gray-700 z-[60]">
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

        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-sm transition-all cursor-pointer">
          <i className="fas fa-sign-out-alt w-5 text-center" /> Chiqish
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto w-full">
        <LiquidNav
            items={links.filter(l => LIQUID_PATHS[l.href]).map(l => ({ href: l.href, label: l.label, icon: LIQUID_PATHS[l.href] }))}
            dark={dark}
            onToggleDark={() => setDark(!dark)}
            hideBrand
            wrapperClassName="lg:left-64 lg:pr-4"
            right={
              <div className="flex items-center gap-2">
                {/* Theme picker */}
                <div className="relative">
                  <button onClick={() => setShowHeaderTheme(!showHeaderTheme)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all ${dark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-500"}`}
                    title="Rang">
                    <i className="fas fa-palette" />
                  </button>
                  {showHeaderTheme && (
                    <div className={`absolute right-0 top-full mt-1 rounded-xl p-2 animate-slideIn shadow-xl border z-[60] ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
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
                <button onClick={() => setSidebarOpen(true)} className={`lg:hidden w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`} title="Menyu">
                  <i className="fas fa-bars" />
                </button>
              </div>
            }
          />
        <div className={`px-4 lg:px-8 pt-20 pb-10 max-w-7xl mx-auto w-full ${dark ? "text-gray-200" : ""}`}>{children}</div>
      </main>
    </div>
  )
}