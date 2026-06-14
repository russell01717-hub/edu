"use client"
import { useEffect, useState } from "react"

export default function AttendancePage() {
  const [groups, setGroups] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [topic, setTopic] = useState("")
  const [step, setStep] = useState("select")
  const [students, setStudents] = useState<any[]>([])
  const [attendances, setAttendances] = useState<Record<number, string>>({})
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null)
  const [msg, setMsg] = useState("")

  useEffect(() => { fetch("/api/groups").then(r => r.json()).then(setGroups) }, [])

  async function startLesson() {
    if (!selectedGroup || !date) return
    const res = await fetch("/api/lessons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ groupId: parseInt(selectedGroup), date, topic }) })
    const lesson = await res.json()
    setCurrentLessonId(lesson.id)
    const res2 = await fetch(`/api/students?groupId=${selectedGroup}`)
    const sts = await res2.json()
    setStudents(sts)
    const att: Record<number, string> = {}
    sts.forEach((s: any) => { att[s.id] = "present" })
    setAttendances(att); setStep("taking"); setMsg("")
  }

  function toggleStatus(id: number) {
    setAttendances(prev => {
      const cur = prev[id]
      const next = cur === "present" ? "absent" : cur === "absent" ? "late" : "present"
      return { ...prev, [id]: next }
    })
  }

  async function saveAttendance() {
    if (!currentLessonId) return
    const data = Object.entries(attendances).map(([sid, status]) => ({ studentId: parseInt(sid), lessonId: currentLessonId, status }))
    await fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attendances: data }) })
    setMsg("Davomat saqlandi!")
    setTimeout(() => { setStep("select"); setMsg(""); setCurrentLessonId(null); setStudents([]) }, 1000)
  }

  const statusConfig: Record<string, any> = {
    present: { label: "Keldi", bg: "#d1fae5", border: "#6ee7b7", color: "#065f46" },
    late: { label: "Kechikdi", bg: "#fef3c7", border: "#fcd34d", color: "#92400e" },
    absent: { label: "Kelmadi", bg: "#fee2e2", border: "#fca5a5", color: "#991b1b" },
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Davomat</h1>
        <p className="text-sm text-gray-400">Darsga kelgan/kelmaganlarni belgilang</p>
      </div>
      {step === "select" ? (
        <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-full sm:w-48">
              <label className="text-xs text-gray-400 block mb-1 font-medium">Guruh</label>
              <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="input-field">
                <option value="">Tanlang</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="w-full sm:w-40">
              <label className="text-xs text-gray-400 block mb-1 font-medium">Sana</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
            </div>
            <div className="w-full sm:flex-1">
              <label className="text-xs text-gray-400 block mb-1 font-medium">Mavzu</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} className="input-field" />
            </div>
            <button onClick={startLesson} className="btn-orange px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto" style={{ marginTop: "22px" }}>✓ Darsni boshlash</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Davomat olish</h2>
                <p className="text-sm text-gray-400">Sana: {date} {topic ? `| ${topic}` : ""}</p>
              </div>
              <button onClick={saveAttendance} className="btn-orange px-5 py-2 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto">✓ Saqlash</button>
            </div>
            {msg && <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-xl font-medium animate-bounceIn text-sm">{msg}</div>}
          </div>
          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-400"><span className="text-3xl block mb-2">👤</span>Bu guruhda o'quvchilar yo'q</div>
          ) : (
            students.map(s => {
              const cfg = statusConfig[attendances[s.id]] || statusConfig.present
              return (
                <div key={s.id} onClick={() => toggleStatus(s.id)}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 mb-2 hover:bg-gray-50 hover:translate-x-1 transition-all cursor-pointer">
                  <span className="font-medium text-gray-900">{s.name}</span>
                  <button className="px-5 py-1.5 rounded-xl font-semibold text-sm border-2 transition-all hover:scale-105 cursor-pointer"
                    style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
                    {cfg.label}
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
