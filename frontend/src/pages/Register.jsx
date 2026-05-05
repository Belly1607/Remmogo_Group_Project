import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Register({ onLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const response = await API.post('/auth/register', {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      })

      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      onLogin(user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-content page-form">
      <div className="auth-card">
        <section>
          <p className="eyebrow">WELCOME TO RE-MMOGO APP</p>
          <h2>REGISTER</h2>
        </section>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me5690@gmail.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary, #1a3c34)' }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}