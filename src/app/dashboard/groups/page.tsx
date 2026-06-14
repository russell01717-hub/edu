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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Guruhlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>➕ Yangi guruh</button>
      </div>
      {showForm && (
        <form onSubmit={create} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-3 items-end animate-slideIn">
          <div className="flex-1"><label className="text-xs text-gray-400 block mb-1 font-medium">Nomi</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-gray-50 transition-all" required /></div>
          <div className="flex-1"><label className="text-xs text-gray-400 block mb-1 font-medium">Izoh</label><input value={desc} onChange={e => setDesc(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-gray-50 transition-all" /></div>
          <div className="w-44"><label className="text-xs text-gray-400 block mb-1 font-medium">Dars narxi (so'm)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-gray-50 transition-all" /></div>
          <button type="submit" className="px-5 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg cursor-pointer" style={{ background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "22px" }}>✓ Saqlash</button>
        </form>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Nomi</th><th className="py-3 px-4">Izoh</th><th className="py-3 px-4">Dars narxi</th><th className="py-3 px-4">O'quvchilar</th><th className="py-3 px-4">#</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-semibold">{g.name}</td>
                <td className="py-3 px-4 text-gray-400">{g.description || "-"}</td>
                <td className="py-3 px-4">{g.pricePerLesson.toLocaleString()} so'm</td>
                <td className="py-3 px-4">{g.studentCount}</td>
                <td className="py-3 px-4">
                  <button onClick={() => del(g.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>🗑</button>
                </td>
              </tr>
            ))}
            {groups.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400">📚 Guruhlar mavjud emas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
