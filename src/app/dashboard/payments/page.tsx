"use client"
import { useEffect, useState } from "react"
import { authHeaders } from "@/lib/auth-client"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [studentId, setStudentId] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [pdate, setPdate] = useState(new Date().toISOString().split("T")[0])

  function load() { fetch("/api/payments", { headers: authHeaders(false) }).then(r => r.json()).then(setPayments); fetch("/api/students", { headers: authHeaders(false) }).then(r => r.json()).then(setStudents) }
  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/payments", { method: "POST", headers: authHeaders(), body: JSON.stringify({ studentId: parseInt(studentId), amount: parseInt(amount), note, date: pdate }) })
    setStudentId(""); setAmount(""); setNote(""); setShowForm(false); load()
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">To'lovlar</h1>
          <p className="page-desc"><i className="fas fa-credit-card" style={{ color: "var(--theme-primary)" }} />Barcha to'lovlar tarixi</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer w-full sm:w-auto justify-center">
          <i className="fas fa-plus" /> Yangi to'lov
        </button>
      </div>
      {showForm && (
        <form onSubmit={create} className="card p-4 lg:p-5 mb-6 flex flex-col sm:flex-row gap-3 items-end animate-slideIn">
          <div className="w-full sm:w-48">
            <label className="text-xs text-gray-400 block mb-1 font-medium"><i className="fas fa-user-graduate mr-1" />O'quvchi</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="input-field" required>
              <option value="">Tanlang</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.balance?.toLocaleString()})</option>)}
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-gray-400 block mb-1 font-medium"><i className="fas fa-coins mr-1" />Summa (so'm)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" required />
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-gray-400 block mb-1 font-medium"><i className="fas fa-calendar-day mr-1" />Sana</label>
            <input type="date" value={pdate} onChange={e => setPdate(e.target.value)} className="input-field" />
          </div>
          <div className="w-full sm:flex-1">
            <label className="text-xs text-gray-400 block mb-1 font-medium"><i className="fas fa-pen mr-1" />Izoh</label>
            <input value={note} onChange={e => setNote(e.target.value)} className="input-field" />
          </div>
          <button type="submit" className="btn-primary px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer w-full sm:w-auto flex items-center gap-2" style={{ marginTop: "22px" }}>
            <i className="fas fa-check" /> Saqlash
          </button>
        </form>
      )}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px] table-modern">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="py-3 px-4">O'quvchi</th><th className="py-3 px-4">Guruh</th><th className="py-3 px-4">Summa</th><th className="py-3 px-4">Turi</th><th className="py-3 px-4">Izoh</th><th className="py-3 px-4">Sana</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td className="py-3 px-4 font-semibold text-gray-900"><i className="fas fa-user mr-1 text-gray-400" />{p.studentName}</td>
                  <td className="py-3 px-4">{p.groupName}</td>
                  <td className={`py-3 px-4 font-semibold ${p.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {p.type === "income" ? "+" : "-"}{Math.abs(p.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${p.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      <i className={`fas ${p.type === "income" ? "fa-arrow-up" : "fa-arrow-down"} mr-1`} />
                      {p.type === "income" ? "To'lov" : "Chegirma"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{p.note || "-"}</td>
                  <td className="py-3 px-4 text-gray-500">{p.date}</td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-gray-400">
                <i className="fas fa-credit-card text-4xl block mb-2" />To'lovlar mavjud emas</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}