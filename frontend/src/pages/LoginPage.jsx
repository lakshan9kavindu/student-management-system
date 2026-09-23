import { useState } from 'react'
import { apiRequest } from '../api'
import StatusMessage from '../components/StatusMessage'

const emptyForm = { name: '', indexNumber: '', email: '', password: '' }

export default function LoginPage({ onAuthenticated, initialMessage = '' }) {
  const [mode, setMode] = useState('student-login')
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState({ type: initialMessage ? 'success' : '', message: initialMessage })
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'student-register'
  const isAdmin = mode === 'admin-login'

  function changeMode(nextMode) {
    setMode(nextMode)
    setForm(emptyForm)
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
      const data = await apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) })
      if (isRegister) {
        setMode('student-login')
        setForm({ ...emptyForm, email: form.email })
        setStatus({ type: 'success', message: 'Account created. You can log in now.' })
      } else {
        onAuthenticated(data)
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
          <StatusMessage status={status} />
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
