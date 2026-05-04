export default function Dashboard({ groups, members, transactions }) {
  const pending = transactions.filter((tx) => !tx.approved).length
  const approved = transactions.filter((tx) => tx.approved).length
  const totalLoan = members.reduce((sum, member) => sum + member.loanBalance, 0)
  const totalContributions = members.reduce((sum, member) => sum + member.totalContributions, 0)

  return (
    <main className="page-content">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Re-Mmogo group overview</h2>
          
        </div>
        <div className="hero-cards">
          <article className="stat-card">
            <p>Groups registered</p>
            <strong>{groups.length}</strong>
          </article>
          <article className="stat-card">
            <p>Members enrolled</p>
            <strong>{members.length}</strong>
          </article>
          <article className="stat-card">
            <p>Pending approvals</p>
            <strong>{pending}</strong>
          </article>
          <article className="stat-card">
            <p>Approved actions</p>
            <strong>{approved}</strong>
          </article>
        </div>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <h3>Group health</h3>
          <p>{groups.length ? 'All groups are ready to accept members and contributions.' : 'Register a motshelo group to get started.'}</p>
        </article>
        <article className="summary-card">
          <h3>Total contributions</h3>
          <p>P{totalContributions.toLocaleString()}</p>
        </article>
        <article className="summary-card">
          <h3>Total loan balance</h3>
          <p>P{totalLoan.toLocaleString()}</p>
        </article>
      </section>
    </main>
  )
}
