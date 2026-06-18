"use client"
import { useEffect, useState } from "react"

function calcMonths(startDate: string): number {
  if (!startDate) return 0
  const s = new Date(startDate)
  const n = new Date()
  return (n.getFullYear() - s.getFullYear()) * 12 + n.getMonth() - s.getMonth() + 1
}

function calcMonthlyFee(startDate: string, pricePerLesson: number, daysCount: number, groupMonthlyFee = 0): number {
  if (groupMonthlyFee > 0) return groupMonthlyFee
  const months = calcMonths(startDate)
  if (months <= 0 || !pricePerLesson) return 0
  return pricePerLesson * daysCount * 4
}

function getTokenUser(): any {
  try { return JSON.parse(atob(localStorage.getItem("token") || "")) } catch { return null }
}

function pad2(n: number): string { return n < 10 ? "0" + n : "" + n }

function formatStamp(d: string): string {
  if (!d) return ""
  const dt = new Date(d)
  return dt.getFullYear() + "/" + pad2(dt.getMonth() + 1) + "/" + pad2(dt.getDate())
}

const MONTH_NAMES = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"]

function feePeriod(): string {
  const d = new Date()
  const cur = MONTH_NAMES[d.getMonth()]
  const next = MONTH_NAMES[(d.getMonth() + 1) % 12]
  return `1 ${cur} - 1 ${next}`
}

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [attMap, setAttMap] = useState<Record<string, string>>({})
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("+998")
  const [groupId, setGroupId] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [search, setSearch] = useState("")
  const [err, setErr] = useState("")

  const user = getTokenUser()

  function getMonth() { return new Date().toISOString().substring(0, 7) }

  async function loadData() {
    const u = getTokenUser()
    if (!u) return
    const month = getMonth()
    const params = u.role === "teacher" ? `?role=teacher&teacherId=${u.id}&_=${Date.now()}` : `?_=${Date.now()}`
    const [s, g, l] = await Promise.all([
      fetch(`/api/students${params}`).then(r => r.json()),
      fetch(`/api/groups${params}`).then(r => r.json()),
      fetch(`/api/lessons${params}`).then(r => r.json()),
    ])
    setStudents(s); setGroups(g)
    const monthLessons = l.filter((le: any) => le.date?.startsWith(month)).sort((a: any, b: any) => a.date?.localeCompare(b.date))
    setLessons(monthLessons)
    const res = await fetch(`/api/attendance?month=${month}&_=${Date.now()}`)
    if (res.ok) {
      const allAtts = await res.json()
      const atts: Record<string, string> = {}
      allAtts.forEach((a: any) => { atts[`${a.studentId}_${a.lessonId}`] = a.status })
      setAttMap(atts)
    }
  }
  useEffect(() => {
    loadData()
    const iv = setInterval(() => {
      if (getMonth() !== new Date().toISOString().substring(0, 7)) loadData()
    }, 60000)
    const onVis = () => { if (document.visibilityState === "visible") loadData() }
    document.addEventListener("visibilitychange", onVis)
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", onVis) }
  }, [])

  function handlePhone(val: string) {
    if (!val.startsWith("+998")) val = "+998" + val.replace(/[^0-9]/g, "").slice(0, 9)
    const digits = val.replace(/[^0-9]/g, "").slice(0, 12)
    setPhone("+" + digits)
  }

  async function create(e: React.FormEvent) {
    e.preventDefault(); setErr("")
    if (!name.trim()) { setErr("Ism kiritilmagan"); return }
    const gid = groupId || (groups.length > 0 ? groups[0].id.toString() : "")
    if (!gid) { setErr("Guruh topilmadi"); return }
    const res = await fetch("/api/students", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, groupId: parseInt(gid), startDate }),
    })
    if (!res.ok) { const d = await res.json(); setErr(d.error || "Xatolik"); return }
    setName(""); setPhone("+998"); setGroupId(""); setStartDate(new Date().toISOString().split("T")[0]); setShowForm(false); loadData()
  }

  async function del(id: number) {
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/students?id=${id}`, { method: "DELETE" }); loadData()
  }

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search))

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
          <p className="text-sm text-gray-400"><i className="fas fa-user-graduate mr-1" style={{ color: "var(--theme-primary)" }} />{user?.role === "teacher" ? "Sizning o'quvchilaringiz" : "Barcha o'quvchilar"}</p>
        </div>
        <button onClick={() => {
          setShowForm(!showForm)
          if (!showForm && user?.role === "teacher" && groups.length > 0) setGroupId(groups[0].id.toString())
        }} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          <i className="fas fa-plus" /> Yangi o'quvchi
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="O'quvchi qidirish..." className="input-field !pl-10" />
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3 items-end animate-slideIn">
          {err && <div className="w-full p-3 bg-red-50 text-red-600 rounded-xl text-sm"><i className="fas fa-exclamation-circle mr-1" />{err}</div>}
          <div className="w-full sm:flex-1">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Ism</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          </div>
          <div className="w-full sm:w-44">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Telefon</label>
            <input value={phone} onChange={e => handlePhone(e.target.value)} className="input-field" />
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Boshlagan sana</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div className="w-full sm:w-44">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Guruh</label>
            {user?.role === "admin" ? (
              <select value={groupId} onChange={e => setGroupId(e.target.value)} className="input-field" required>
                <option value="">Tanlang</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}{g.subject ? ` (${g.subject === "arabic" ? "Arab tili" : g.subject === "english" ? "Ingliz tili" : g.subject})` : ""}</option>)}
              </select>
            ) : groups.length > 1 ? (
              <select value={groupId} onChange={e => setGroupId(e.target.value)} className="input-field" required>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            ) : (
              <div className="input-field bg-gray-100 text-gray-500 flex items-center gap-2">
                <i className="fas fa-lock text-xs" />
                {groups.find(g => g.id.toString() === groupId)?.name || groups[0]?.name || "Guruh"}
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto flex items-center gap-2" style={{ marginTop: "22px" }}>
            <i className="fas fa-check" /> Saqlash
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const group = groups.find(g => g.id === s.groupId)
          const daysCount = group?.days ? group.days.split(",").filter(Boolean).length : 0
          const monthlyFee = calcMonthlyFee(s.startDate, group?.pricePerLesson || 0, daysCount, group?.monthlyFee || 0)
          const monthsCount = calcMonths(s.startDate)

          const monthAtts = lessons
            .filter(l => l.groupId === s.groupId)
            .map(l => ({ lesson: l, status: attMap[`${s.id}_${l.id}`] || null }))

          return (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 card-hover animate-scaleIn relative overflow-hidden group"
              style={{ transformStyle: "preserve-3d", perspective: "800px" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)", transform: "translateX(100%)", transition: "all 0.6s" }} />

              {s.startDate && (
                <div className="absolute -top-1 -right-1 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-1 right-1 w-14 h-14 flex items-center justify-center border-2 border-orange-400 text-orange-500 font-bold text-[10px] leading-tight text-center rotate-12 rounded-lg bg-orange-50/80 opacity-70"
                    style={{ transform: "rotate(15deg)" }}>
                    {formatStamp(s.startDate)}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.name}</h3>
                  <p className="text-xs text-gray-400"><i className="fas fa-phone mr-1" />{s.phone || "Telefon yo'q"}</p>
                  {s.startDate && <p className="text-xs text-gray-400 mt-0.5"><i className="fas fa-calendar-check mr-1" />{s.startDate} ({monthsCount} oy)</p>}
                </div>
                <button onClick={() => del(s.id)} className="p-1.5 rounded-lg text-xs hover:bg-red-50 text-red-400 hover:text-red-600 transition cursor-pointer">
                  <i className="fas fa-trash-can" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-3 py-1 rounded-lg font-semibold text-white" style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }}>
                  <i className={`fas ${group?.subject === "arabic" ? "fa-language" : group?.subject === "english" ? "fa-book-open" : "fa-layer-group"} mr-1`} />
                  {s.groupName}
                </span>
                {group?.subject && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: "color-mix(in srgb, var(--theme-primary) 15%, transparent)", color: "var(--theme-primary)" }}>
                    {group.subject === "arabic" ? "Arab tili" : group.subject === "english" ? "Ingliz tili" : group.subject}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl mb-3 text-center relative overflow-hidden" style={{ background: s.balance >= 0 ? "#f0fdf4" : "#fef2f2" }}>
                <p className="text-xs text-gray-400"><i className="fas fa-wallet mr-1" />Balans</p>
                <p className={`text-2xl font-bold ${s.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {s.balance.toLocaleString()} <span className="text-sm font-normal">so'm</span>
                </p>
                {monthlyFee > 0 && <p className="text-[10px] text-gray-400 mt-0.5">{feePeriod()}: {monthlyFee.toLocaleString()} so'm</p>}
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1.5 font-medium"><i className="fas fa-calendar-alt mr-1" />Oy davomida</p>
                {monthAtts.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {monthAtts.filter(ma => ma.lesson.date).map((ma, i) => {
                      const day = ma.lesson.date.slice(8, 10)
                      const color = !ma.status ? "bg-gray-200 text-gray-500"
                        : ma.status === "present" ? "bg-green-500 text-white"
                        : ma.status === "late" ? "bg-yellow-500 text-white"
                        : "bg-red-500 text-white"
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${color}`}>{day}</div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-300 italic text-center py-2"><i className="fas fa-info-circle mr-1" />Bu oyda darslar hali boshlanmagan</p>
                )}
              </div>
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