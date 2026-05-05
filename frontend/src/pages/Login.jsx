import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      setLoading(false)
      return
    }

    try {
      const response = await API.post('/auth/login', { username, password })
      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      onLogin(user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-content page-form">
      <div className="auth-card">
        <section>
          <p className="eyebrow">MEMBER LOGIN</p>
          <h2>SIGN-IN</h2>
        </section>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary, #1a3c34)' }}>
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}