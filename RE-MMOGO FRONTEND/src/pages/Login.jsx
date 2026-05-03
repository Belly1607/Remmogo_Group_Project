import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    onLogin({ name: username.trim() })
    navigate('/')
  }

  return (
    <main className="page-content page-form">
      <div className="auth-card">
        <section>
          <p className="eyebrow">WELCOME TO RE-MMOGO APP</p>
          <h2>SIGN-IN</h2>
        </section>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="me5690-@gmail.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="button-primary">
            Log in
          </button>
        </form>
      </div>
    </main>
  )
}
