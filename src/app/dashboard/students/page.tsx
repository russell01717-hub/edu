"use client"
import { useEffect, useState } from "react"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [groupId, setGroupId] = useState("")

  function load() {
    fetch("/api/students").then(r => r.json()).then(setStudents)
    fetch("/api/groups").then(r => r.json()).then(setGroups)
  }
  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, groupId: parseInt(groupId) }),
    })
    setName(""); setPhone(""); setGroupId(""); setShowForm(false); load()
  }

  async function del(id: number) {
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/students?id=${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">O'quvchilar</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Yangi o'quvchi
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-1">Ism</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div className="w-40">
            <label className="text-sm text-gray-500 block mb-1">Telefon</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="w-48">
            <label className="text-sm text-gray-500 block mb-1">Guruh</label>
            <select value={groupId} onChange={e => setGroupId(e.target.value)} className="w-full border rounded-lg px-3 py-2" required>
              <option value="">Tanlang</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Saqlash</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="py-3 px-4">Ism</th>
              <th className="py-3 px-4">Telefon</th>
              <th className="py-3 px-4">Guruh</th>
              <th className="py-3 px-4">Balans (so'm)</th>
              <th className="py-3 px-4">#</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t">
                <td className="py-3 px-4">{s.name}</td>
                <td className="py-3 px-4">{s.phone || "-"}</td>
                <td className="py-3 px-4">{s.groupName}</td>
                <td className={`py-3 px-4 font-medium ${s.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                  {s.balance.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => del(s.id)} className="text-red-500 hover:text-red-700 text-xs">O'chirish</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">O'quvchilar mavjud emas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
