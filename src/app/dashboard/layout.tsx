"use client"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/"); return }
    try { setUser(JSON.parse(atob(token))) } catch { router.push("/") }
  }, [])

  function logout() {
    localStorage.removeItem("token")
    router.push("/")
  }

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
      <aside className="w-64 flex flex-col p-6 text-white animate-slideIn"
        style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)" }}>
        <h2 className="text-xl font-bold">EduPlatform</h2>
        <p className="text-indigo-300 text-sm mb-8">Arab tili markazi</p>
        <nav className="flex-1 space-y-1">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-white/15 text-white font-semibold" : "text-indigo-200 hover:bg-white/10 hover:text-white hover:translate-x-1"}`}>
                <span>{l.icon}</span> {l.label}
              </Link>
            )
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-indigo-300 hover:bg-red-500/15 hover:text-red-300 rounded-xl text-sm transition-all mt-auto cursor-pointer">
          🚪 Chiqish
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8 animate-fadeIn">{children}</main>
    </div>
  )
}
