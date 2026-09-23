export default function DashboardLayout({ title, children, onLogout }) {
  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <span className="brand-mark small">SM</span>
          <div>
            <p className="eyebrow">Student management system</p>
            <h1>{title}</h1>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout} type="button">
          Log out <span aria-hidden="true">↗</span>
        </button>
      </header>
      {children}
    </main>
  )
}
