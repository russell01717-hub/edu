"use client"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">O'quvchilar</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.students || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Guruhlar</p>
          <p className="text-3xl font-bold text-blue-600">{stats.groups || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Darslar</p>
          <p className="text-3xl font-bold text-green-600">{stats.lessons || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">To'lovlar (sum)</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.totalPayments?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold mb-3">Oxirgi davomat</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">O'quvchi</th>
              <th className="py-2">Guruh</th>
              <th className="py-2">Sana</th>
              <th className="py-2">Holat</th>
            </tr>
          </thead>
          <tbody>
            {(stats.recentAttendance || []).map((a: any) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="py-2">{a.studentName}</td>
                <td className="py-2">{a.groupName}</td>
                <td className="py-2">{a.date}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${a.status === "present" ? "bg-green-100 text-green-700" : a.status === "late" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {a.status === "present" ? "Keldi" : a.status === "late" ? "Kechikdi" : "Kelmadi"}
                  </span>
                </td>
              </tr>
            ))}
            {(!stats.recentAttendance || stats.recentAttendance.length === 0) && (
              <tr><td colSpan={4} className="py-4 text-center text-gray-400">Hozircha ma'lumot yo'q</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
