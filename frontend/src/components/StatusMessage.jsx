export default function StatusMessage({ status, className = '' }) {
  if (!status.message) return null
  return <p className={`form-status ${className} ${status.type}`}>{status.message}</p>
}
