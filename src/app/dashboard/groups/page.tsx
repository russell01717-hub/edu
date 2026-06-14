"use client"
import { useEffect, useState } from "react"

const DAYS_UZ = ["Yak", "Du", "Se", "Chor", "Pay", "Jum", "Shan"]
const DAYS_FULL = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [price, setPrice] = useState("")
  const [days, setDays] = useState<string[]>([])

  function toggleDay(d: string) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort())
  }

  function load() { fetch("/api/groups").then(r => r.json()).then(setGroups) }
  useEffect(load, [])

  function openCreate() {
    setEditId(null); setName(""); setDesc(""); setPrice(""); setDays([]); setShowForm(true)
  }

  function openEdit(g: any) {
    setEditId(g.id); setName(g.name); setDesc(g.description || ""); setPrice(g.pricePerLesson?.toString() || "")
    setDays(g.days ? g.days.split(",").filter(Boolean) : []); setShowForm(true)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const body = JSON.stringify({ name, description: desc, pricePerLesson: parseInt(price) || 0, days: days.join(",") })
    if (editId) {
      await fetch("/api/groups", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, ...JSON.parse(body) }) })
    } else {
      await fetch("/api/groups", { method: "POST", headers: { "Content-Type": "application/json" }, body })
    }
    setName(""); setDesc(""); setPrice(""); setDays([]); setEditId(null); setShowForm(false); load()
  }

  async function del(id: number) {
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/groups?id=${id}`, { method: "DELETE" }); load()
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guruhlar</h1>
          <p className="text-sm text-gray-400">Barcha guruhlarni boshqaring</p>
        </div>
        <button onClick={openCreate} className="btn-orange flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          ➕ Yangi guruh
        </button>
      </div>
      {showForm && (
        <form onSubmit={save} className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-slideIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1 font-medium">Nomi</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1 font-medium">Izoh</label>
              <input value={desc} onChange={e => setDesc(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1 font-medium">Dars narxi (so'm)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-2 font-medium">Hafta kunlari</label>
            <div className="flex flex-wrap gap-2">
              {DAYS_UZ.map((d, i) => (
                <button key={d} type="button" onClick={() => toggleDay(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${days.includes(d) ? "bg-orange-500 text-white shadow-lg scale-105" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  {d}
                </button>
              ))}
            </div>
            {days.length > 0 && <p className="text-xs text-orange-500 mt-1">{days.map(d => DAYS_FULL[DAYS_UZ.indexOf(d)]).join(", ")}</p>}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-orange px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer">✓ Saqlash</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer">Bekor qilish</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(g => (
          <div key={g.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 card-hover animate-scaleIn relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{g.name}</h3>
                  {g.description && <p className="text-xs text-gray-400 mt-0.5">{g.description}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(g)} className="p-1.5 rounded-lg text-xs hover:bg-orange-50 text-orange-500 transition cursor-pointer">✏️</button>
                  <button onClick={() => del(g.id)} className="p-1.5 rounded-lg text-xs hover:bg-red-50 text-red-500 transition cursor-pointer">🗑</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-orange-50 px-3 py-1.5 rounded-xl">
                  <span className="text-orange-600 font-bold">{g.pricePerLesson?.toLocaleString()}</span>
                  <span className="text-gray-400 text-xs ml-1">so'm/dars</span>
                </div>
                <div className="bg-blue-50 px-3 py-1.5 rounded-xl">
                  <span className="text-blue-600 font-bold">{g.studentCount}</span>
                  <span className="text-gray-400 text-xs ml-1">o'quvchi</span>
                </div>
              </div>
              {g.days && (
                <div className="mt-3 flex gap-1.5">
                  {g.days.split(",").filter(Boolean).map((d: string) => (
                    <span key={d} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-400 to-orange-500 text-white">{d}</span>
                  ))}
                  <span className="text-xs text-gray-400 ml-auto self-center">har hafta</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400">
            <span className="text-5xl block mb-3">📚</span>
            <p className="text-lg font-medium">Guruhlar mavjud emas</p>
            <p className="text-sm mt-1">Yangi guruh qo'shish uchun tugmani bosing</p>
          </div>
        )}
      </div>
    </div>
  )
}