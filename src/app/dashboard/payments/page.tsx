"use client"
import { useEffect, useState } from "react"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [studentId, setStudentId] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [pdate, setPdate] = useState(new Date().toISOString().split("T")[0])

  function load() { fetch("/api/payments").then(r => r.json()).then(setPayments); fetch("/api/students").then(r => r.json()).then(setStudents) }
  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId: parseInt(studentId), amount: parseInt(amount), note, date: pdate }) })
    setStudentId(""); setAmount(""); setNote(""); setShowForm(false); load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">To'lovlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>➕ Yangi to'lov</button>
      </div>
      {showForm && (
        <form onSubmit={create} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-3 items-end animate-slideIn">
          <div className="w-48"><label className="text-xs text-gray-400 block mb-1 font-medium">O'quvchi</label><select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 transition-all" required>
            <option value="">Tanlang</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select></div>
          <div className="w-40"><label className="text-xs text-gray-400 block mb-1 font-medium">Summa (so'm)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 transition-all" required /></div>
          <div className="w-40"><label className="text-xs text-gray-400 block mb-1 font-medium">Sana</label><input type="date" value={pdate} onChange={e => setPdate(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 transition-all" /></div>
          <div className="flex-1"><label className="text-xs text-gray-400 block mb-1 font-medium">Izoh</label><input value={note} onChange={e => setNote(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-gray-50 transition-all" /></div>
          <button type="submit" className="px-5 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg cursor-pointer" style={{ background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "22px" }}>✓ Saqlash</button>
        </form>
      )}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">O'quvchi</th><th className="py-3 px-4">Guruh</th><th className="py-3 px-4">Summa</th><th className="py-3 px-4">Turi</th><th className="py-3 px-4">Izoh</th><th className="py-3 px-4">Sana</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-semibold">{p.studentName}</td>
                <td className="py-3 px-4">{p.groupName}</td>
                <td className={`py-3 px-4 font-semibold ${p.type === "income" ? "text-green-600" : "text-red-600"}`}>{p.type === "income" ? "+" : "-"}{Math.abs(p.amount).toLocaleString()}</td>
                <td className="py-3 px-4">{p.type === "income" ? "To'lov" : "Chegirma"}</td>
                <td className="py-3 px-4 text-gray-400">{p.note || "-"}</td>
                <td className="py-3 px-4 text-gray-500">{p.date}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-gray-400">💳 To'lovlar mavjud emas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
