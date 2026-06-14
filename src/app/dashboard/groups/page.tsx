"use client"
import { useEffect, useState } from "react"

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [price, setPrice] = useState("")

  function load() { fetch("/api/groups").then(r => r.json()).then(setGroups) }
  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: desc, pricePerLesson: parseInt(price) || 0 }) })
    setName(""); setDesc(""); setPrice(""); setShowForm(false); load()
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
        <button onClick={() => setShowForm(!showForm)} className="btn-orange flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          ➕ Yangi guruh
        </button>
      </div>
      {showForm && (
        <form onSubmit={create} className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3 items-end animate-slideIn">
          <div className="w-full sm:flex-1">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Nomi</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          </div>
          <div className="w-full sm:flex-1">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Izoh</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="input-field" />
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Dars narxi (so'm)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field" />
          </div>
          <button type="submit" className="btn-orange px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto" style={{ marginTop: "22px" }}>✓ Saqlash</button>
        </form>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4">Nomi</th><th className="py-3 px-4">Izoh</th><th className="py-3 px-4">Dars narxi</th><th className="py-3 px-4">O'quvchilar</th><th className="py-3 px-4">#</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-semibold text-gray-900">{g.name}</td>
                  <td className="py-3 px-4 text-gray-400">{g.description || "-"}</td>
                  <td className="py-3 px-4">{g.pricePerLesson.toLocaleString()} so'm</td>
                  <td className="py-3 px-4">{g.studentCount}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => del(g.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-md transition-all cursor-pointer">🗑</button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400"><span className="text-3xl block mb-2">📚</span>Guruhlar mavjud emas</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
