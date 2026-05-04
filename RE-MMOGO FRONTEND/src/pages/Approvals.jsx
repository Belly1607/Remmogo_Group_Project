export default function Approvals({ transactions, members, groups, onApproveTransaction }) {
  const pending = transactions.filter((tx) => !tx.approved)
  const findMember = (memberId) => members.find((member) => member.id === memberId)
  const findGroup = (member) => groups.find((group) => group.id === member.groupId)

  return (
    <main className="page-content">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Approvals</p>
          <h2>Signatory approvals</h2>
          <p className="intro-text">
            Payments and loans require signatory approval before they are recorded in member balances.
          </p>
        </div>
      </section>

      <section className="table-panel">
        {pending.length ? (
          <div className="approval-grid">
            {pending.map((tx) => {
              const member = findMember(tx.memberId)
              const group = member ? findGroup(member) : null
              return (
                <article key={tx.id} className="approval-card">
                  <h3>{member?.name || 'Unknown member'}</h3>
                  <p>
                    {tx.type === 'contribution' && 'Monthly contribution'}
                    {tx.type === 'loan-request' && 'Loan request'}
                    {tx.type === 'loan-payment' && 'Loan payment'}
                  </p>
                  <p>Amount: P{tx.amount.toLocaleString()}</p>
                  <p>Group: {group?.name || 'Unknown group'}</p>
                  <p>Signatories: {group?.signatories.join(' and ') || '—'}</p>
                  <button className="button-primary" onClick={() => onApproveTransaction(tx.id)}>
                    Approve
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <p>No pending approvals at this time.</p>
        )}
      </section>
    </main>
  )
}
