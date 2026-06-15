"use client"
import { useEffect, useState, useCallback } from "react"

const STAT_LABELS: Record<string, string> = { present: "Keldi", late: "Kechikdi", absent: "Kelmadi" }
const STAT_ICONS: Record<string, string> = { present: "fa-check-circle", late: "fa-clock", absent: "fa-times-circle" }

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [attMap, setAttMap] = useState<Record<string, string>>({})
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [groupId, setGroupId] = useState("")
  const [search, setSearch] = useState("")

  const month = new Date().toISOString().substring(0, 7)
  const today = new Date().toISOString().split("T")[0]

  async function loadAll() {
    const [s, g, l] = await Promise.all([
      fetch("/api/students").then(r => r.json()),
      fetch("/api/groups").then(r => r.json()),
      fetch("/api/lessons").then(r => r.json()),
    ])
    setStudents(s); setGroups(g)
    const monthLessons = l.filter((le: any) => le.date?.startsWith(month)).sort((a: any, b: any) => a.date?.localeCompare(b.date))
    setLessons(monthLessons)
    // Load attendance for this month
    const res = await fetch(`/api/attendance?month=${month}`)
    if (res.ok) {
      const allAtts = await res.json()
      const atts: Record<string, string> = {}
      allAtts.forEach((a: any) => { atts[`${a.studentId}_${a.lessonId}`] = a.status })
      setAttMap(atts)
    }
  }
  const load = useCallback(loadAll, [month])
  useEffect(() => { load() }, [load])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, groupId: parseInt(groupId) }) })
    setName(""); setPhone(""); setGroupId(""); setShowForm(false); load()
  }

  async function del(id: number) {
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/students?id=${id}`, { method: "DELETE" }); load()
  }

  async function markAttendance(studentId: number, status: string) {
    await fetch("/api/attendance/today", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId, status }) })
    load()
  }

  const todayLessonMap: Record<number, any> = {}
  lessons.forEach(l => { if (l.date === today) todayLessonMap[l.groupId] = l })

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search))

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
          <p className="text-sm text-gray-400"><i className="fas fa-check-circle mr-1" style={{ color: "var(--theme-primary)" }} /> Har bir o'quvchiga davomat oling</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          <i className="fas fa-plus" /> Yangi o'quvchi
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="O'quvchi qidirish..." className="input-field pl-10" />
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3 items-end animate-slideIn">
          <div className="w-full sm:flex-1">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Ism</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          </div>
          <div className="w-full sm:w-44">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Telefon</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" />
          </div>
          <div className="w-full sm:w-48">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Guruh</label>
            <select value={groupId} onChange={e => setGroupId(e.target.value)} className="input-field" required>
              <option value="">Tanlang</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}{g.days ? ` (${g.days})` : ""}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto" style={{ marginTop: "22px" }}>
            <i className="fas fa-check mr-1" /> Saqlash
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const todayLesson = todayLessonMap[s.groupId]
          const monthAtts = lessons
            .filter(l => l.groupId === s.groupId)
            .map(l => ({ lesson: l, status: attMap[`${s.id}_${l.id}`] || null }))
          const curStatus = attMap[`${s.id}_${todayLesson?.id}`] || "none"

          return (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 card-hover animate-scaleIn relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] rounded-full -mr-10 -mt-10 pointer-events-none"
                style={{ background: "var(--theme-primary)" }} />

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.name}</h3>
                  <p className="text-xs text-gray-400"><i className="fas fa-phone mr-1" />{s.phone || "Telefon yo'q"}</p>
                </div>
                <button onClick={() => del(s.id)} className="p-1.5 rounded-lg text-xs hover:bg-red-50 text-red-400 hover:text-red-600 transition cursor-pointer">
                  <i className="fas fa-trash-can" />
                </button>
              </div>

              <div className="mb-3">
                <span className="text-xs px-3 py-1 rounded-lg font-semibold text-white" style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }}>
                  <i className="fas fa-layer-group mr-1" />{s.groupName}
                </span>
              </div>

              <div className="p-3 rounded-xl mb-3 text-center" style={{ background: s.balance >= 0 ? "#f0fdf4" : "#fef2f2" }}>
                <p className="text-xs text-gray-400"><i className="fas fa-wallet mr-1" />Balans</p>
                <p className={`text-2xl font-bold ${s.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {s.balance.toLocaleString()} <span className="text-sm font-normal">so'm</span>
                </p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2 font-medium"><i className="fas fa-calendar-day mr-1" />Bugungi davomat</p>
                <div className="flex gap-1.5">
                  {["present", "late", "absent"].map(st => {
                    const active = curStatus === st
                    const icon = STAT_ICONS[st]
                    const label = STAT_LABELS[st]
                    return (
                      <button key={st} onClick={() => markAttendance(s.id, st)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                          ${active
                            ? "text-white shadow-lg scale-105"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          }`}
                        style={active ? { background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` } : {}}>
                        <i className={`fas ${icon} mr-1`} />{label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {monthAtts.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium"><i className="fas fa-calendar-alt mr-1" />Oy davomidagi davomat</p>
                  <div className="flex flex-wrap gap-1.5">
                    {monthAtts.map((ma, i) => {
                      const color = !ma.status ? "bg-gray-200 text-gray-500"
                        : ma.status === "present" ? "bg-green-500 text-white"
                        : ma.status === "late" ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${color}`}
                            title={`${ma.lesson.date}: ${STAT_LABELS[ma.status] || "?"}`}>
                            {i + 1}
                          </div>
                          <span className="text-[9px] text-gray-400 mt-0.5">{ma.lesson.date?.slice(8, 10)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {monthAtts.length === 0 && (
                <p className="text-xs text-gray-300 italic text-center py-2"><i className="fas fa-info-circle mr-1" />Bu oyda darslar hali boshlanmagan</p>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400">
            <i className="fas fa-user-graduate text-5xl block mb-3" />
            <p className="text-lg font-medium">{search ? "Hech narsa topilmadi" : "O'quvchilar mavjud emas"}</p>
          </div>
        )}
      </div>
    </div>
  )
}