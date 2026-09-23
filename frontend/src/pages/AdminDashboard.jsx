import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import StatusMessage from '../components/StatusMessage'
import { apiRequest } from '../api'

export default function AdminDashboard({ onLogout }) {
  const [students, setStudents] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [marksForm, setMarksForm] = useState({ studentId: '', subject: '', marks: '' })

  useEffect(() => { loadStudents() }, [])

  async function loadStudents() {
    setLoading(true)
    try {
      setStudents(await apiRequest('/api/students'))
      setStatus({ type: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name}'s account? This also removes their results.`)) return
    try {
      await apiRequest(`/api/students/${student.id}`, { method: 'DELETE' })
      setStudents(students.filter((item) => item.id !== student.id))
      setStatus({ type: 'success', message: `${student.name}'s account was deleted.` })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function addMarks(event) {
    event.preventDefault()
    try {
      await apiRequest(`/api/results/student/${marksForm.studentId}`, {
        method: 'POST',
        body: JSON.stringify({ subject: marksForm.subject, marks: Number(marksForm.marks) }),
      })
      setMarksForm({ studentId: '', subject: '', marks: '' })
      setStatus({ type: 'success', message: 'Marks added successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <DashboardLayout title="Admin workspace" onLogout={onLogout}>
      <section className="dashboard-content">
        <div className="dashboard-intro"><div><p className="eyebrow">Overview</p><h2>Keep student records moving.</h2></div><button className="refresh-button" onClick={loadStudents} type="button">↻ Refresh</button></div>
        <StatusMessage status={status} className="dashboard-status" />
        <div className="dashboard-grid">
          <section className="dashboard-card students-card">
            <div className="card-heading"><div><p className="eyebrow">Directory</p><h3>Student accounts <span>{students.length}</span></h3></div></div>
            {loading ? <p className="empty-state">Loading student records...</p> : students.length === 0 ? <p className="empty-state">No student accounts found.</p> : <div className="student-list">{students.map((student) => <div className="student-row" key={student.id}><div className="student-avatar">{student.name?.charAt(0).toUpperCase()}</div><div className="student-details"><strong>{student.name}</strong><span>{student.indexNumber} · {student.email}</span></div><button className="delete-button" onClick={() => deleteStudent(student)} type="button">Delete</button></div>)}</div>}
          </section>
          <section className="dashboard-card marks-card">
            <div className="card-heading"><p className="eyebrow">Results</p><h3>Add marks</h3></div>
            <form onSubmit={addMarks} className="marks-form">
              <label>Student<select value={marksForm.studentId} onChange={(event) => setMarksForm({ ...marksForm, studentId: event.target.value })} required><option value="">Choose a student</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.indexNumber}</option>)}</select></label>
              <label>Subject<input value={marksForm.subject} onChange={(event) => setMarksForm({ ...marksForm, subject: event.target.value })} placeholder="Information Technology" required /></label>
              <label>Marks<input type="number" min="0" max="100" step="0.01" value={marksForm.marks} onChange={(event) => setMarksForm({ ...marksForm, marks: event.target.value })} placeholder="85.50" required /></label>
              <button className="submit-button" type="submit" disabled={!students.length}>Add marks <span aria-hidden="true">↗</span></button>
            </form>
          </section>
        </div>
      </section>
    </DashboardLayout>
  )
}
