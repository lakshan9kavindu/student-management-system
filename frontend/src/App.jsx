import { useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState('student-login')
  const [form, setForm] = useState({ name: '', indexNumber: '', email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'student-register'
  const isAdmin = mode === 'admin-login'

  function changeMode(nextMode) {
    setMode(nextMode)
    setForm({ name: '', indexNumber: '', email: '', password: '' })
    setStatus({ type: '', message: '' })
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
        setStatus({ type: 'success', message: `${data.role.toLowerCase()} login successful.` })
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
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
