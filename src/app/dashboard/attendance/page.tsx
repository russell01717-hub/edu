"use client"
import { useEffect, useState } from "react"

export default function AttendancePage() {
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [topic, setTopic] = useState("")
  const [lessonId, setLessonId] = useState<number | null>(null)
  const [attendances, setAttendances] = useState<Record<number, string>>({})
  const [message, setMessage] = useState("")

  useEffect(() => { fetch("/api/groups").then(r => r.json()).then(setGroups) }, [])

  async function startLesson() {
    if (!selectedGroup || !date) return
    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: parseInt(selectedGroup), date, topic }),
    })
    const data = await res.json()
    setLessonId(data.id)

    const res2 = await fetch(`/api/students?groupId=${selectedGroup}`)
    const st = await res2.json()
    setStudents(st)

    const att: Record<number, string> = {}
    st.forEach((s: any) => { att[s.id] = "present" })
    setAttendances(att)
    setMessage("")
  }

  async function saveAttendance() {
    if (!lessonId) return
    const data = Object.entries(attendances).map(([studentId, status]) => ({
      studentId: parseInt(studentId),
      lessonId,
      status,
    }))
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendances: data }),
    })
    if (res.ok) {
      setMessage("Davomat saqlandi!")
      setLessonId(null)
      setStudents([])
      setTopic("")
      setSelectedGroup("")
    }
  }

  function toggleStatus(studentId: number) {
    setAttendances(prev => {
      const current = prev[studentId]
      const next = current === "present" ? "absent" : current === "absent" ? "late" : "present"
      return { ...prev, [studentId]: next }
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Davomat</h1>

      {!lessonId ? (
        <div className="bg-white p-5 rounded-xl shadow-sm border mb-6">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm text-gray-500 block mb-1">Guruh</label>
              <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="">Tanlang</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Sana</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded-lg px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 block mb-1">Mavzu</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <button onClick={startLesson} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
              Darsni boshlash
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white p-5 rounded-xl shadow-sm border mb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-semibold text-lg">Davomat olish</h2>
                <p className="text-gray-500 text-sm">Sana: {date} | {topic && `Mavzu: ${topic}`}</p>
              </div>
              <button onClick={saveAttendance} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
                Saqlash
              </button>
            </div>
            {message && <p className="text-green-600 mb-3">{message}</p>}

            <div className="grid gap-2">
              {students.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{s.name}</span>
                  <button
                    onClick={() => toggleStatus(s.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                      attendances[s.id] === "present" ? "bg-green-100 text-green-700 border border-green-300" :
                      attendances[s.id] === "late" ? "bg-yellow-100 text-yellow-700 border border-yellow-300" :
                      "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {attendances[s.id] === "present" ? "Keldi" : attendances[s.id] === "late" ? "Kechikdi" : "Kelmadi"}
                  </button>
                </div>
              ))}
              {students.length === 0 && <p className="text-gray-400 text-center py-4">Bu guruhda o'quvchilar yo'q</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
