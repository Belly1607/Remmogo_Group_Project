import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SiteHeader from './components/SiteHeader.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GroupRegistration from './pages/GroupRegistration.jsx'
import MemberEnrollment from './pages/MemberEnrollment.jsx'
import Contributions from './pages/Contributions.jsx'
import Loans from './pages/Loans.jsx'
import Approvals from './pages/Approvals.jsx'
import Reports from './pages/Reports.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogin = (newUser) => setUser(newUser)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const protectedElement = (element) => (user ? element : <Navigate to="/login" replace />)

  return (
    <BrowserRouter>
      <div className={user ? 'app-shell' : 'auth-shell'}>
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        {user && <SiteHeader user={user} onLogout={handleLogout} />}
        <div className={user ? 'content-area' : 'auth-content'}>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />}
            />
            <Route path="/" element={protectedElement(<Dashboard />)} />
            <Route path="/register-group" element={protectedElement(<GroupRegistration onCreateGroup={() => {}} />)} />
            <Route path="/enroll-member" element={protectedElement(<MemberEnrollment onCreateMember={() => {}} />)} />
            <Route path="/contributions" element={protectedElement(<Contributions />)} />
            <Route path="/loans" element={protectedElement(<Loans />)} />
            <Route path="/approvals" element={protectedElement(<Approvals />)} />
            <Route path="/reports" element={protectedElement(<Reports />)} />
            <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App