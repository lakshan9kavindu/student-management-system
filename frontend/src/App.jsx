import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState(localStorage.getItem('userRole') === 'ADMIN' ? 'admin-dashboard' : 'student-login')
  const [form, setForm] = useState({ name: '', indexNumber: '', email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [marksForm, setMarksForm] = useState({ studentId: '', subject: '', marks: '' })
  const [studentProfile, setStudentProfile] = useState(null)
  const [studentResults, setStudentResults] = useState([])
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })

  const isRegister = mode === 'student-register'
  const isAdmin = mode === 'admin-login'
  const isDashboard = mode === 'admin-dashboard'
  const isStudentDashboard = mode === 'student-dashboard'

  useEffect(() => {
    if (isDashboard) loadStudents()
    if (isStudentDashboard) loadStudentDashboard()
  }, [isDashboard, isStudentDashboard])

  async function authorizedRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken')
    const response = await fetch(endpoint, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
    })
    if (!response.ok) throw new Error((await response.text()) || 'Request could not be completed')
    return response.status === 204 ? null : response.json()
  }

  async function loadStudents() {
    setDashboardLoading(true)
    try {
      setStudents(await authorizedRequest('/api/students'))
      setStatus({ type: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setDashboardLoading(false)
    }
  }

  async function loadStudentDashboard() {
    setDashboardLoading(true)
    const studentId = localStorage.getItem('userId')
    try {
      const [profile, results] = await Promise.all([
        authorizedRequest(`/api/students/${studentId}`),
        authorizedRequest(`/api/results/student/${studentId}`),
      ])
      setStudentProfile(profile)
      setProfileForm({ name: profile.name, email: profile.email || '' })
      setStudentResults(results)
      setStatus({ type: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setDashboardLoading(false)
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setForm({ name: '', indexNumber: '', email: '', password: '' })
    setStatus({ type: '', message: '' })
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name}'s account? This also removes their results.`)) return
    try {
      await authorizedRequest(`/api/students/${student.id}`, { method: 'DELETE' })
      setStudents(students.filter((item) => item.id !== student.id))
      setStatus({ type: 'success', message: `${student.name}'s account was deleted.` })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function addMarks(event) {
    event.preventDefault()
    try {
      await authorizedRequest(`/api/results/student/${marksForm.studentId}`, {
        method: 'POST',
        body: JSON.stringify({ subject: marksForm.subject, marks: Number(marksForm.marks) }),
      })
      setMarksForm({ studentId: '', subject: '', marks: '' })
      setStatus({ type: 'success', message: 'Marks added successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function updateProfile(event) {
    event.preventDefault()
    try {
      const updatedProfile = await authorizedRequest(`/api/students/${studentProfile.id}`, {
        method: 'PUT',
        body: JSON.stringify(profileForm),
      })
      setStudentProfile(updatedProfile)
      setStatus({ type: 'success', message: 'Profile information updated.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  async function deleteOwnAccount() {
    if (!window.confirm('Delete your account? This will also remove all your results.')) return
    try {
      await authorizedRequest(`/api/students/${localStorage.getItem('userId')}`, { method: 'DELETE' })
      logout()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  function logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    setStudents([])
    setMode('student-login')
    setStatus({ type: 'success', message: 'You have been logged out.' })
  }

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submitForm(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setLoading(true)
    const endpoint = isRegister ? '/api/students' : `/api/auth/${isAdmin ? 'admin' : 'student'}/login`
    const body = isRegister ? form : { email: form.email, password: form.password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error((await response.text()) || 'Request could not be completed')
      const data = await response.json()
      if (isRegister) {
        setStatus({ type: 'success', message: 'Account created. You can log in now.' })
        setForm({ name: '', indexNumber: '', email: form.email, password: '' })
        setMode('student-login')
      } else {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('userRole', data.role)
        localStorage.setItem('userId', String(data.userId))
        if (data.role === 'ADMIN') {
          setMode('admin-dashboard')
        } else {
          setMode('student-dashboard')
        }
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  if (isDashboard) {
    return (
      <main className="dashboard-shell">
        <header className="dashboard-header">
          <div className="dashboard-brand"><span className="brand-mark small">SM</span><div><p className="eyebrow">Student management system</p><h1>Admin workspace</h1></div></div>
          <button className="logout-button" onClick={logout} type="button">Log out <span aria-hidden="true">↗</span></button>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-intro"><div><p className="eyebrow">Overview</p><h2>Keep student records moving.</h2></div><button className="refresh-button" onClick={loadStudents} type="button">↻ Refresh</button></div>
          {status.message && <p className={`form-status dashboard-status ${status.type}`}>{status.message}</p>}

          <div className="dashboard-grid">
            <section className="dashboard-card students-card">
              <div className="card-heading"><div><p className="eyebrow">Directory</p><h3>Student accounts <span>{students.length}</span></h3></div></div>
              {dashboardLoading ? <p className="empty-state">Loading student records...</p> : students.length === 0 ? <p className="empty-state">No student accounts found.</p> : <div className="student-list">
                {students.map((student) => <div className="student-row" key={student.id}><div className="student-avatar">{student.name?.charAt(0).toUpperCase()}</div><div className="student-details"><strong>{student.name}</strong><span>{student.indexNumber} · {student.email}</span></div><button className="delete-button" onClick={() => deleteStudent(student)} type="button" title={`Delete ${student.name}`}>Delete</button></div>)}
              </div>}
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
      </main>
    )
  }

  if (isStudentDashboard) {
    return (
      <main className="dashboard-shell student-dashboard-shell">
        <header className="dashboard-header">
          <div className="dashboard-brand"><span className="brand-mark small">SM</span><div><p className="eyebrow">Student management system</p><h1>Student space</h1></div></div>
          <button className="logout-button" onClick={logout} type="button">Log out <span aria-hidden="true">↗</span></button>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-intro"><div><p className="eyebrow">Your overview</p><h2>Welcome, {studentProfile?.name || 'student'}.</h2></div><button className="refresh-button" onClick={loadStudentDashboard} type="button">↻ Refresh</button></div>
          {status.message && <p className={`form-status dashboard-status ${status.type}`}>{status.message}</p>}

          {dashboardLoading ? <p className="empty-state">Loading your student space...</p> : <div className="student-dashboard-grid">
            <section className="dashboard-card results-card">
              <div className="card-heading"><p className="eyebrow">Academic record</p><h3>Your marks <span>{studentResults.length}</span></h3></div>
              {studentResults.length === 0 ? <p className="empty-state">No results have been added yet.</p> : <div className="results-list">{studentResults.map((result) => <div className="result-row" key={result.id}><div><strong>{result.subject}</strong><span>Academic result</span></div><b>{result.marks}</b></div>)}</div>}
            </section>

            <section className="dashboard-card profile-card">
              <div className="card-heading"><p className="eyebrow">Account</p><h3>Edit information</h3></div>
              <form onSubmit={updateProfile} className="marks-form">
                <label>Full name<input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required /></label>
                <label>Email address<input type="email" value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} required /></label>
                <p className="profile-readonly">Index number: <strong>{studentProfile?.indexNumber}</strong></p>
                <button className="submit-button" type="submit">Save changes <span aria-hidden="true">↗</span></button>
              </form>
              <button className="danger-account-button" onClick={deleteOwnAccount} type="button">Delete my account</button>
            </section>
          </div>}
        </section>
      </main>
    )
  }

  return (
    <main className="auth-shell">
      <section className="intro-panel">
        <div className="brand-mark">SM</div>
        <p className="eyebrow">Student management system</p>
        <h1>Make progress visible.</h1>
        <p className="intro-copy">A clear place for students to access results and administrators to keep records moving.</p>
        <div className="intro-rule" />
        <p className="status-note"><span className="status-dot" /> Secure account access</p>
      </section>

      <section className="form-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>{isRegister ? 'Create your student account' : isAdmin ? 'Administrator access' : 'Sign in to continue'}</h2>
          </div>
          <span className="panel-index">01 / 02</span>
        </div>

        {!isAdmin && <div className="mode-switch" aria-label="Student account mode">
          <button className={!isRegister ? 'active' : ''} onClick={() => changeMode('student-login')} type="button">Student login</button>
          <button className={isRegister ? 'active' : ''} onClick={() => changeMode('student-register')} type="button">Register</button>
        </div>}

        <form onSubmit={submitForm}>
          {isRegister && <div className="field-row">
            <label>Full name<input name="name" value={form.name} onChange={updateField} placeholder="Your name" required /></label>
            <label>Index number<input name="indexNumber" value={form.indexNumber} onChange={updateField} placeholder="100001W" required /></label>
          </div>}
          <label>Email address<input type="email" name="email" value={form.email} onChange={updateField} placeholder="you@example.com" required /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={updateField} placeholder="Enter your password" minLength="6" required /></label>
          {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}
          <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'} {!loading && <span aria-hidden="true">↗</span>}</button>
        </form>

        <div className="panel-footer">
          {isAdmin ? <button className="text-button" type="button" onClick={() => changeMode('student-login')}>← Student access</button> : <button className="text-button" type="button" onClick={() => changeMode('admin-login')}>Administrator access →</button>}
          <span>Passwords are encrypted</span>
        </div>
      </section>
    </main>
  )
}

export default App
