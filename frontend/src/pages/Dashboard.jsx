import { useState, useEffect } from 'react'
import API from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    groups: 0,
    members: 0,
    pending: 0,
    approved: 0,
    totalContributions: 0,
    totalLoanBalance: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [groupsRes, membersRes, pendingRes, approvedRes] = await Promise.all([
          API.get('/groups'),
          API.get('/members'),
          API.get('/transactions?approved=false'),
          API.get('/transactions?approved=true'),
        ])

        const members = membersRes.data
        const totalContributions = members.reduce(
          (sum, m) => sum + parseFloat(m.total_contributions || 0), 0
        )
        const totalLoanBalance = members.reduce(
          (sum, m) => sum + parseFloat(m.loan_balance || 0), 0
        )

        setStats({
          groups: groupsRes.data.length,
          members: members.length,
          pending: pendingRes.data.length,
          approved: approvedRes.data.length,
          totalContributions,
          totalLoanBalance,
        })
      } catch (err) {
        console.error('Failed to load dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <main className="page-content">
        <p>Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="page-content">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Re-Mmogo group overview</h2>
          <p className="intro-text">
            Keep track of groups, members, loan activity, contribution approvals, and year-end reports.
          </p>
        </div>
        <div className="hero-cards">
          <article className="stat-card">
            <p>Groups registered</p>
            <strong>{stats.groups}</strong>
          </article>
          <article className="stat-card">
            <p>Members enrolled</p>
            <strong>{stats.members}</strong>
          </article>
          <article className="stat-card">
            <p>Pending approvals</p>
            <strong>{stats.pending}</strong>
          </article>
          <article className="stat-card">
            <p>Approved actions</p>
            <strong>{stats.approved}</strong>
          </article>
        </div>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <h3>Group health</h3>
          <p>
            {stats.groups
              ? 'All groups are ready to accept members and contributions.'
              : 'Register a motshelo group to get started.'}
          </p>
        </article>
        <article className="summary-card">
          <h3>Total contributions</h3>
          <p>P{stats.totalContributions.toLocaleString()}</p>
        </article>
        <article className="summary-card">
          <h3>Total loan balance</h3>
          <p>P{stats.totalLoanBalance.toLocaleString()}</p>
        </article>
      </section>
    </main>
  )
}