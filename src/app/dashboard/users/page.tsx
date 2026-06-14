"use client"
import { useEffect, useState } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [error, setError] = useState("")

  const currentUserId = (() => { try { return JSON.parse(atob(localStorage.getItem("token") || "")).id } catch { return 0 } })()

  function load() { fetch("/api/users").then(r => r.json()).then(setUsers) }
  useEffect(load, [])

  function resetForm() { setName(""); setLogin(""); setPassword(""); setRole("admin"); setEditId(null); setError("") }

  async function create(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, login, password, role }) })
    if (!res.ok) { setError((await res.json()).error); return }
    resetForm(); setShowForm(false); load()
  }

  async function update(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const res = await fetch("/api/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, name, password: password || undefined }) })
    if (!res.ok) { setError((await res.json()).error); return }
    resetForm(); setShowForm(false); load()
  }

  function edit(u: any) { setEditId(u.id); setName(u.name); setLogin(u.login); setPassword(""); setRole(u.role || "admin"); setShowForm(true) }

  async function del(id: number) {
    if (id === 1) { alert("Admin o'chirilmaydi"); return }
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/users?id=${id}`, { method: "DELETE" }); load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Foydalanuvchilar</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>➕ Yangi foydalanuvchi</button>
      </div>
      {showForm && (
        <form onSubmit={editId ? update : create} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-3 items-end animate-slideIn">
          <div className="flex-1"><label className="text-xs text-gray-400 block mb-1 font-medium">Ism</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 transition-all" required /></div>
          <div className="w-40"><label className="text-xs text-gray-400 block mb-1 font-medium">Login</label><input value={login} onChange={e => setLogin(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 transition-all" required disabled={!!editId} /></div>
          <div className="w-40"><label className="text-xs text-gray-400 block mb-1 font-medium">Parol</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 transition-all" placeholder={editId ? "Yangi parol" : ""} required={!editId} /></div>
          <button type="submit" className="px-5 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg cursor-pointer" style={{ background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "22px" }}>{editId ? "✓ Yangilash" : "✓ Saqlash"}</button>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </form>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Ism</th><th className="py-3 px-4">Login</th><th className="py-3 px-4">Rol</th><th className="py-3 px-4">Yaratilgan</th><th className="py-3 px-4">#</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium">{u.name} {u.id === currentUserId && <span className="text-xs text-indigo-500 ml-1">(siz)</span>}</td>
                <td className="py-3 px-4">{u.login}</td>
                <td className="py-3 px-4">{u.role === "admin" ? "Admin" : "O'qituvchi"}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 space-x-2">
                  <button onClick={() => edit(u)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all cursor-pointer">Tahrirlash</button>
                  {u.id !== 1 && <button onClick={() => del(u.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer">O'chirish</button>}
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400">👤 Foydalanuvchilar mavjud emas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
