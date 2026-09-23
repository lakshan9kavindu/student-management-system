import { useState } from 'react'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/StudentDashboard'
import { clearSession, saveSession } from './api'
import './App.css'

function getInitialPage() {
  const role = localStorage.getItem('userRole')
  if (role === 'ADMIN') return 'admin-dashboard'
  if (role === 'STUDENT') return 'student-dashboard'
  return 'login'
}

function App() {
  const [page, setPage] = useState(getInitialPage)
  const [loginMessage, setLoginMessage] = useState('')

  function handleAuthenticated(data) {
    saveSession(data)
    setPage(data.role === 'ADMIN' ? 'admin-dashboard' : 'student-dashboard')
  }

  function logout() {
    clearSession()
    setLoginMessage('You have been logged out.')
    setPage('login')
  }

  if (page === 'admin-dashboard') return <AdminDashboard onLogout={logout} />
  if (page === 'student-dashboard') return <StudentDashboard onLogout={logout} />
  return <LoginPage onAuthenticated={handleAuthenticated} initialMessage={loginMessage} />
}

export default App
