export default function Reports({ members }) {
  const totalContributions = members.reduce((sum, member) => sum + member.totalContributions, 0)
  const totalLoanBalance = members.reduce((sum, member) => sum + member.loanBalance, 0)
  const membersWithInterest = members.map((member) => {
    const expectedInterest = Math.round(member.loanBalance * 0.2 * 12)
    return {
      ...member,
      expectedInterest,
      interestTargetRemaining: Math.max(0, 5000 - expectedInterest),
    }
  })

  const sortedByInterest = [...membersWithInterest].sort((a, b) => b.expectedInterest - a.expectedInterest)
  const topInterest = sortedByInterest[0]
  const leastInterest = sortedByInterest[sortedByInterest.length - 1]

  return (
    <main className="page-content">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Reports</p>
          <h2>Year-end summary</h2>
          <p className="intro-text">
            Review contribution totals, loan exposure, and member interest performance for your motshelo group.
          </p>
        </div>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <h3>Total contributions</h3>
          <p>P{totalContributions.toLocaleString()}</p>
        </article>
        <article className="summary-card">
          <h3>Loan exposure</h3>
          <p>P{totalLoanBalance.toLocaleString()}</p>
        </article>
        <article className="summary-card">
          <h3>Highest expected interest</h3>
          <p>{topInterest ? `P${topInterest.expectedInterest.toLocaleString()}` : 'N/A'}</p>
        </article>
        <article className="summary-card">
          <h3>Lowest expected interest</h3>
          <p>{leastInterest ? `P${leastInterest.expectedInterest.toLocaleString()}` : 'N/A'}</p>
        </article>
      </section>

      <section className="table-panel">
        <h3>Member performance</h3>
        {membersWithInterest.length ? (
          <div className="report-grid">
            {membersWithInterest.map((member) => (
              <article key={member.id} className="report-card">
                <h4>{member.name}</h4>
                <p>Contributions: P{member.totalContributions.toLocaleString()}</p>
                <p>Loan balance: P{member.loanBalance.toLocaleString()}</p>
                <p>Expected interest: P{member.expectedInterest.toLocaleString()}</p>
                <p>Interest target left: P{member.interestTargetRemaining.toLocaleString()}</p>
              </article>
            ))}
          </div>
        ) : (
          <p>No members enrolled yet.</p>
        )}
      </section>
    </main>
  )
}
