"use client"
import { useEffect, useState } from "react"

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([])

  useEffect(() => { fetch("/api/lessons").then(r => r.json()).then(setLessons) }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Darslar tarixi</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="py-3 px-4">Sana</th>
              <th className="py-3 px-4">Guruh</th>
              <th className="py-3 px-4">Mavzu</th>
              <th className="py-3 px-4">Davomat</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(l => (
              <tr key={l.id} className="border-t">
                <td className="py-3 px-4">{l.date}</td>
                <td className="py-3 px-4">{l.groupName}</td>
                <td className="py-3 px-4 text-gray-600">{l.topic || "-"}</td>
                <td className="py-3 px-4">
                  <span className="text-green-600">{l.presentCount}</span>
                  <span className="text-gray-400">/{l.totalCount} </span>
                  {l.absentCount > 0 && <span className="text-red-600">({l.absentCount} qoldirgan)</span>}
                </td>
              </tr>
            ))}
            {lessons.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-gray-400">Darslar mavjud emas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
