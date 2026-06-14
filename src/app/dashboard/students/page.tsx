"use client"
import { useEffect, useState } from "react"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [groupId, setGroupId] = useState("")

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">O'quvchilar</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>➕ Yangi o'quvchi</button>
      </div>
      {showForm && (
        <form onSubmit={create} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-3 items-end animate-slideIn">
          <div className="flex-1"><label className="text-xs text-gray-400 block mb-1 font-medium">Ism</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-gray-50 transition-all" required /></div>
          <div className="w-44"><label className="text-xs text-gray-400 block mb-1 font-medium">Telefon</label><input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-gray-50 transition-all" /></div>
          <div className="w-48"><label className="text-xs text-gray-400 block mb-1 font-medium">Guruh</label><select value={groupId} onChange={e => setGroupId(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white bg-gray-50 transition-all" required>
            <option value="">Tanlang</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select></div>
          <button type="submit" className="px-5 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg cursor-pointer" style={{ background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "22px" }}>✓ Saqlash</button>
        </form>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Ism</th><th className="py-3 px-4">Telefon</th><th className="py-3 px-4">Guruh</th><th className="py-3 px-4">Balans (so'm)</th><th className="py-3 px-4">#</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-semibold">{s.name}</td>
                <td className="py-3 px-4 text-gray-400">{s.phone || "-"}</td>
                <td className="py-3 px-4">{s.groupName}</td>
                <td className={`py-3 px-4 font-semibold ${s.balance < 0 ? "text-red-600" : "text-green-600"}`}>{s.balance.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <button onClick={() => del(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>🗑</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400">👨‍🎓 O'quvchilar mavjud emas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
