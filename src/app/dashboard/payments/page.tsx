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

  function load() {
    fetch("/api/payments").then(r => r.json()).then(setPayments)
    fetch("/api/students").then(r => r.json()).then(setStudents)
  }
  useEffect(load, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: parseInt(studentId), amount: parseInt(amount), note, date: pdate }),
    })
    setStudentId(""); setAmount(""); setNote(""); setShowForm(false); load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">To'lovlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          + Yangi to'lov
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-1">O'quvchi</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border rounded-lg px-3 py-2" required>
              <option value="">Tanlang</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.groupName})</option>)}
            </select>
          </div>
          <div className="w-40">
            <label className="text-sm text-gray-500 block mb-1">Summa (so'm)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Sana</label>
            <input type="date" value={pdate} onChange={e => setPdate(e.target.value)} className="border rounded-lg px-3 py-2" />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-1">Izoh</label>
            <input value={note} onChange={e => setNote(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Saqlash</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500">
              <th className="py-3 px-4">O'quvchi</th>
              <th className="py-3 px-4">Guruh</th>
              <th className="py-3 px-4">Summa</th>
              <th className="py-3 px-4">Turi</th>
              <th className="py-3 px-4">Izoh</th>
              <th className="py-3 px-4">Sana</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t">
                <td className="py-3 px-4">{p.studentName}</td>
                <td className="py-3 px-4">{p.groupName}</td>
                <td className={`py-3 px-4 font-medium ${p.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {p.type === "income" ? "+" : "-"}{Math.abs(p.amount).toLocaleString()}
                </td>
                <td className="py-3 px-4">{p.type === "income" ? "To'lov" : "Chegirma"}</td>
                <td className="py-3 px-4 text-gray-500">{p.note || "-"}</td>
                <td className="py-3 px-4">{p.date}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">To'lovlar mavjud emas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
