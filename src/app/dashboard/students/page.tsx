"use client"
import { useEffect, useState } from "react"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [groupId, setGroupId] = useState("")
  const [search, setSearch] = useState("")

  function load() { fetch("/api/students").then(r => r.json()).then(setStudents); fetch("/api/groups").then(r => r.json()).then(setGroups) }
  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, phone, groupId: parseInt(groupId) }) })
    setName(""); setPhone(""); setGroupId(""); setShowForm(false); load()
  }

  async function del(id: number) {
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/students?id=${id}`, { method: "DELETE" }); load()
  }

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.phone?.includes(search))

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
          <p className="text-sm text-gray-400">Barcha o'quvchilar ro'yxati</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          ➕ Yangi o'quvchi
        </button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 O'quvchi qidirish..." className="input-field mb-4 max-w-md" />

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
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto" style={{ marginTop: "22px" }}>✓ Saqlash</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 card-hover animate-scaleIn relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" style={{ background: "var(--theme-primary)" }} />
            <div className="relative">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{s.name}</h3>
                  <p className="text-xs text-gray-400">{s.phone || "Telefon yo'q"}</p>
                </div>
                <button onClick={() => del(s.id)} className="p-1.5 rounded-lg text-xs hover:bg-red-50 text-red-500 transition cursor-pointer">🗑</button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2.5 py-1 rounded-lg font-semibold text-white" style={{ background: `linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))` }}>{s.groupName}</span>
              </div>
              <div className="mt-3 p-3 rounded-xl" style={{ background: s.balance >= 0 ? "#f0fdf4" : "#fef2f2" }}>
                <p className="text-xs text-gray-400">Balans</p>
                <p className={`text-xl font-bold ${s.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {s.balance.toLocaleString()} <span className="text-xs font-normal">so'm</span>
                </p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400">
            <span className="text-5xl block mb-3">👨‍🎓</span>
            <p className="text-lg font-medium">{search ? "Hech narsa topilmadi" : "O'quvchilar mavjud emas"}</p>
          </div>
        )}
      </div>
    </div>
  )
}