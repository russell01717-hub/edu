"use client"
import { useEffect, useState } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const currentUserId = (() => { try { return JSON.parse(atob(localStorage.getItem("token") || "")).id } catch { return 0 } })()

  function load() { fetch("/api/users").then(r => r.json()).then(setUsers) }
  useEffect(load, [])

  function resetForm() { setName(""); setLogin(""); setPassword(""); setEditId(null); setError("") }

  async function create(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, login, password }) })
    if (!res.ok) { setError((await res.json()).error); return }
    resetForm(); setShowForm(false); load()
  }

  async function update(e: React.FormEvent) {
    e.preventDefault(); setError("")
    const res = await fetch("/api/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editId, name, password: password || undefined }) })
    if (!res.ok) { setError((await res.json()).error); return }
    resetForm(); setShowForm(false); load()
  }

  function edit(u: any) { setEditId(u.id); setName(u.name); setLogin(u.login); setPassword(""); setShowForm(true) }

  async function del(id: number) {
    if (id === 1) { alert("Admin o'chirilmaydi"); return }
    if (!confirm("O'chirasizmi?")) return
    await fetch(`/api/users?id=${id}`, { method: "DELETE" }); load()
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <p className="text-sm text-gray-400">Tizim foydalanuvchilarini boshqaring</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          ➕ Yangi foydalanuvchi
        </button>
      </div>
      {showForm && (
        <form onSubmit={editId ? update : create} className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-3 items-end animate-slideIn">
          <div className="w-full sm:flex-1">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Ism</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" required />
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Login</label>
            <input value={login} onChange={e => setLogin(e.target.value)} className="input-field" required disabled={!!editId} />
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-gray-400 block mb-1 font-medium">Parol</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder={editId ? "Yangi" : ""} required={!editId} />
          </div>
          <button type="submit" className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer w-full sm:w-auto" style={{ marginTop: "22px" }}>{editId ? "✓ Yangilash" : "✓ Saqlash"}</button>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </form>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-4">Ism</th><th className="py-3 px-4">Login</th><th className="py-3 px-4">Rol</th><th className="py-3 px-4">Yaratilgan</th><th className="py-3 px-4">#</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium text-gray-900">{u.name} {u.id === currentUserId && <span className="text-xs text-orange-500 ml-1">(siz)</span>}</td>
                  <td className="py-3 px-4">{u.login}</td>
                  <td className="py-3 px-4">{u.role === "admin" ? "Admin" : "O'qituvchi"}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button onClick={() => edit(u)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all cursor-pointer">Tahrirlash</button>
                    {u.id !== 1 && <button onClick={() => del(u.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer">O'chirish</button>}
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400"><span className="text-3xl block mb-2">👤</span>Foydalanuvchilar mavjud emas</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
