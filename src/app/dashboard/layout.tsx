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
    try {
      setUser(JSON.parse(atob(token)))
    } catch { router.push("/") }
  }, [])

  function logout() {
    localStorage.removeItem("token")
    router.push("/")
  }

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/groups", label: "Guruhlar" },
    { href: "/dashboard/students", label: "O'quvchilar" },
    { href: "/dashboard/attendance", label: "Davomat" },
    { href: "/dashboard/payments", label: "To'lovlar" },
    { href: "/dashboard/lessons", label: "Darslar" },
    { href: "/dashboard/users", label: "Foydalanuvchilar" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-indigo-900 text-white p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-1">EduPlatform</h2>
        <p className="text-indigo-300 text-sm mb-6">Arab tili markazi</p>
        <nav className="flex-1 space-y-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-4 py-2.5 rounded-lg transition ${pathname === l.href ? "bg-indigo-700 text-white" : "text-indigo-200 hover:bg-indigo-800"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-4 text-indigo-300 hover:text-white transition text-sm">Chiqish</button>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
