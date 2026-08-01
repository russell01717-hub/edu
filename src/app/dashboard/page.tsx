"use client"
import { useEffect, useState } from "react"
import { getTokenUser, authHeaders } from "@/lib/auth-client"

export default function DashboardPage() {
  const [data, setData] = useState({ students: 0, groups: 0, lessons: 0, totalPayments: 0, recentAttendance: [] as any[] })

  const user = getTokenUser()
  const isTeacher = user?.role === "teacher"

  useEffect(() => {
    const u = getTokenUser()
    if (!u) return
    fetch(`/api/stats?_=${Date.now()}`, { headers: authHeaders(false) }).then(r => r.json()).then(setData)
  }, [])

  const statusLabel: Record<string, string> = { present: "Keldi", late: "Kechikdi", absent: "Kelmadi" }
  const statusStyle: Record<string, string> = { present: "bg-green-100 text-green-700", late: "bg-yellow-100 text-yellow-700", absent: "bg-red-100 text-red-700" }

  const cards = [
    { label: "O'quvchilar", value: data.students, icon: "fa-user-graduate", delay: "0.1s" },
    { label: "Guruhlar", value: data.groups, icon: "fa-users", delay: "0.2s" },
    { label: "Darslar", value: data.lessons, icon: "fa-book", delay: "0.3s" },
    { label: "To'lovlar (so'm)", value: data.totalPayments.toLocaleString(), icon: "fa-credit-card", delay: "0.4s" },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-desc"><i className="fas fa-hand-wave" style={{ color: "var(--theme-primary)" }} /> Xush kelibsiz{user?.name ? `, ${user.name}` : ""}!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {cards.map((s, i) => (
          <div key={i} className="card p-4 lg:p-5 card-hover relative overflow-hidden"
            style={{ animation: `scaleIn 0.5s ease-out ${s.delay} both` }}>
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"
              style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }} />
            <div className="relative">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ background: "color-mix(in srgb, var(--theme-primary) 12%, transparent)", color: "var(--theme-primary)" }}>
                <i className={`fas ${s.icon} text-lg`} />
              </div>
              <p className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {!isTeacher && <div className="card p-4 lg:p-5 animate-slideUp">
        <h2 className="text-base font-semibold text-gray-900 mb-4"><i className="fas fa-clipboard-list mr-2" style={{ color: "var(--theme-primary)" }} />Oxirgi davomat</h2>
        {data.recentAttendance.length === 0 ? (
          <div className="text-center py-12 text-gray-400 animate-fadeIn">
            <i className="fas fa-clipboard text-4xl block mb-2" />
            Hozircha ma'lumot yo'q
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px] table-modern">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="py-3 pr-4">O'quvchi</th><th className="py-3 pr-4">Guruh</th><th className="py-3 pr-4">Sana</th><th className="py-3">Holat</th>
                </tr>
              </thead>
              <tbody>{data.recentAttendance.map((a: any) => (
                <tr key={a.id}>
                  <td className="py-3 pr-4 font-medium text-gray-900">{a.studentName}</td>
                  <td className="py-3 pr-4 text-gray-500">{a.groupName}</td>
                  <td className="py-3 pr-4 text-gray-500">{a.date}</td>
                  <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[a.status] || ""}`}>
                    <i className={`fas ${a.status === "present" ? "fa-check-circle" : a.status === "late" ? "fa-clock" : "fa-times-circle"} mr-1`} />
                    {statusLabel[a.status] || a.status}
                  </span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>}
    </div>
  )
}