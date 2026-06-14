"use client"
import { useEffect, useState } from "react"

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([])

  useEffect(() => { fetch("/api/lessons").then(r => r.json()).then(setLessons) }, [])

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Darslar tarixi</h1>
        <p className="text-sm text-gray-400">Barcha o'tilgan darslar ro'yxati</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4">Sana</th><th className="py-3 px-4">Guruh</th><th className="py-3 px-4">Mavzu</th><th className="py-3 px-4">Davomat</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{l.date}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{l.groupName}</td>
                  <td className="py-3 px-4 text-gray-400">{l.topic || "-"}</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-semibold">{l.presentCount}</span>
                    <span className="text-gray-300">/{l.totalCount}</span>
                    {l.absentCount > 0 && <span className="text-red-500 text-xs ml-2">({l.absentCount} qoldirgan)</span>}
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-gray-400"><span className="text-3xl block mb-2">📖</span>Darslar mavjud emas</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
