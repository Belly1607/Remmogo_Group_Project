import { NavLink } from 'react-router-dom'

export default function SiteHeader({ user, onLogout }) {
  return (
    <aside className="site-header">
      <div className="branding">
        <p className="eyebrow">Re-Mmogo WebApp</p>
        <h1>Manage motshelo</h1>
      </div>

      <nav className="site-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/register-group">Group</NavLink>
        <NavLink to="/enroll-member">Members</NavLink>
        <NavLink to="/contributions">Contributions</NavLink>
        <NavLink to="/loans">Loans</NavLink>
        <NavLink to="/approvals">Approvals</NavLink>
        <NavLink to="/reports">Reports</NavLink>
      </nav>

      {user ? (
        <button type="button" className="logout-button" onClick={onLogout}>
          Logout
        </button>
      ) : null}
    </aside>
  )
}
