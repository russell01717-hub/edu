"use client"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [data, setData] = useState({ students: 0, groups: 0, lessons: 0, totalPayments: 0, recentAttendance: [] as any[] })

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setData)
  }, [])

  const statusLabel: Record<string, string> = { present: "Keldi", late: "Kechikdi", absent: "Kelmadi" }
  const statusClass: Record<string, string> = { present: "text-green-700 bg-green-100", late: "text-yellow-700 bg-yellow-100", absent: "text-red-700 bg-red-100" }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "O'quvchilar", value: data.students, color: "text-indigo-600", delay: "0.1s" },
          { label: "Guruhlar", value: data.groups, color: "text-blue-600", delay: "0.2s" },
          { label: "Darslar", value: data.lessons, color: "text-green-600", delay: "0.3s" },
          { label: "To'lovlar (so'm)", value: data.totalPayments.toLocaleString(), color: "text-emerald-600", delay: "0.4s" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all"
            style={{ animation: `scaleIn 0.5s ease-out ${s.delay} both` }}>
            <p className="text-sm text-gray-400 mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Oxirgi davomat</h2>
        {data.recentAttendance.length === 0 ? (
          <div className="text-center py-8 text-gray-400 animate-fadeIn">📋 Hozircha ma'lumot yo'q</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">O'quvchi</th><th className="py-3 px-4">Guruh</th><th className="py-3 px-4">Sana</th><th className="py-3 px-4">Holat</th>
                </tr>
              </thead>
              <tbody>{data.recentAttendance.map((a: any) => (
                <tr key={a.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium">{a.studentName}</td>
                  <td className="py-3 px-4 text-gray-500">{a.groupName}</td>
                  <td className="py-3 px-4 text-gray-500">{a.date}</td>
                  <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass[a.status] || ""}`}>{statusLabel[a.status] || a.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
