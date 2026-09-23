import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import StatusMessage from '../components/StatusMessage'
import { apiRequest } from '../api'

export default function StudentDashboard({ onLogout }) {
  const [profile, setProfile] = useState(null)
  const [results, setResults] = useState([])
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const studentId = localStorage.getItem('userId')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const [student, studentResults] = await Promise.all([
        apiRequest(`/api/students/${studentId}`),
        apiRequest(`/api/results/student/${studentId}`),
      ])
      setProfile(student)
      setProfileForm({ name: student.name, email: student.email || '' })
      setResults(studentResults)
      setStatus({ type: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { loadDashboard() }, [loadDashboard])

  async function updateProfile(event) {
    event.preventDefault()
    try {
      const updatedProfile = await apiRequest(`/api/students/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(profileForm),
      })
      setProfile(updatedProfile)
      setStatus({ type: 'success', message: 'Profile information updated.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function deleteAccount() {
    if (!window.confirm('Delete your account? This will also remove all your results.')) return
    try {
      await apiRequest(`/api/students/${studentId}`, { method: 'DELETE' })
      onLogout()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <DashboardLayout title="Student space" onLogout={onLogout}>
      <section className="dashboard-content">
        <div className="dashboard-intro"><div><p className="eyebrow">Your overview</p><h2>Welcome, {profile?.name || 'student'}.</h2></div><button className="refresh-button" onClick={loadDashboard} type="button">↻ Refresh</button></div>
        <StatusMessage status={status} className="dashboard-status" />
        {loading ? <p className="empty-state">Loading your student space...</p> : <div className="student-dashboard-grid">
          <section className="dashboard-card results-card">
            <div className="card-heading"><p className="eyebrow">Academic record</p><h3>Your marks <span>{results.length}</span></h3></div>
            {results.length === 0 ? <p className="empty-state">No results have been added yet.</p> : <div className="results-list">{results.map((result) => <div className="result-row" key={result.id}><div><strong>{result.subject}</strong><span>Academic result</span></div><b>{result.marks}</b></div>)}</div>}
          </section>
          <section className="dashboard-card profile-card">
            <div className="card-heading"><p className="eyebrow">Account</p><h3>Edit information</h3></div>
            <form onSubmit={updateProfile} className="marks-form">
              <label>Full name<input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required /></label>
              <label>Email address<input type="email" value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} required /></label>
              <p className="profile-readonly">Index number: <strong>{profile?.indexNumber}</strong></p>
              <button className="submit-button" type="submit">Save changes <span aria-hidden="true">↗</span></button>
            </form>
            <button className="danger-account-button" onClick={deleteAccount} type="button">Delete my account</button>
          </section>
        </div>}
      </section>
    </DashboardLayout>
  )
}
