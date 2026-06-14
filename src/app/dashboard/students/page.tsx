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
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
          <p className="text-sm text-gray-400">Barcha o'quvchilar ro'yxati</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-orange flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          ➕ Yangi o'quvchi
        </button>
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
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-orange px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto" style={{ marginTop: "22px" }}>✓ Saqlash</button>
        </form>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4">Ism</th><th className="py-3 px-4">Telefon</th><th className="py-3 px-4">Guruh</th><th className="py-3 px-4">Balans</th><th className="py-3 px-4">#</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-semibold text-gray-900">{s.name}</td>
                  <td className="py-3 px-4 text-gray-400">{s.phone || "-"}</td>
                  <td className="py-3 px-4">{s.groupName}</td>
                  <td className={`py-3 px-4 font-semibold ${s.balance < 0 ? "text-red-600" : "text-green-600"}`}>{s.balance.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => del(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-md transition-all cursor-pointer">🗑</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400"><span className="text-3xl block mb-2">👨‍🎓</span>O'quvchilar mavjud emas</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
