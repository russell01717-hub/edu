"use client"
import { useEffect, useState } from "react"

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [price, setPrice] = useState("")

  function load() {
    fetch("/api/groups").then(r => r.json()).then(setGroups)
  }
  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc, pricePerLesson: parseInt(price) || 0 }),
    })
    setName(""); setDesc(""); setPrice(""); setShowForm(false); load()
  }

  async function del(id: number) {
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/groups?id=${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Guruhlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Yangi guruh
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-1">Nomi</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-1">Izoh</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="w-32">
            <label className="text-sm text-gray-500 block mb-1">Dars narxi (so'm)</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2" type="number" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Saqlash</button>
        </form>
      )}

      <div className="grid gap-4">
        {groups.map(g => (
          <div key={g.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{g.name}</h3>
              <p className="text-gray-500 text-sm">{g.description || "Izohsiz"} | Dars: {g.pricePerLesson.toLocaleString()} so'm | O'quvchilar: {g.studentCount}</p>
            </div>
            <button onClick={() => del(g.id)} className="text-red-500 hover:text-red-700">O'chirish</button>
          </div>
        ))}
        {groups.length === 0 && <p className="text-gray-400 text-center py-8">Guruhlar mavjud emas</p>}
      </div>
    </div>
  )
}
