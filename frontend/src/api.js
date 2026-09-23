export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken')
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error((await response.text()) || 'Request could not be completed')
  }

  return response.status === 204 ? null : response.json()
}

export function clearSession() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
}

export function saveSession(data) {
  localStorage.setItem('authToken', data.token)
  localStorage.setItem('userRole', data.role)
  localStorage.setItem('userId', String(data.userId))
}
