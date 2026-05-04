import { useState } from 'react'

export default function Contributions({ members, onCreateTransaction, transactions }) {
  const [memberId, setMemberId] = useState(members[0]?.id || '')
  const [amount, setAmount] = useState(1000)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const pendingContributions = transactions.filter((tx) => tx.type === 'contribution' && !tx.approved)

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!memberId) {
      setError('Choose a member to submit the monthly contribution.')
      return
    }

    if (amount !== 1000) {
      setError('Monthly contributions must be exactly P1000.')
      return
    }

    const tx = {
      id: `tx-${Date.now()}`,
      memberId,
      type: 'contribution',
      amount,
      approved: false,
      createdAt: new Date().toISOString(),
    }

    onCreateTransaction(tx)
    setSuccess('Contribution recorded and waiting for signatory approval.')
  }

  return (
    <main className="page-content page-form">
      <section>
        <p className="eyebrow">Monthly contributions</p>
        <h2>Submit contribution payment</h2>
        <p className="intro-text">
          Members initiate the monthly payment here. The payment will only count when a signatory approves it.
        </p>
      </section>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <label>
          Select member
          <select value={memberId} onChange={(event) => setMemberId(event.target.value)} required>
            <option value="">Choose member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Amount (P)
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            min="1000"
            max="1000"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="button-primary" disabled={!members.length}>
          Submit payment
        </button>
      </form>

      <section className="table-panel">
        <h3>Pending contributions</h3>
        {pendingContributions.length ? (
          <ul className="action-list">
            {pendingContributions.map((tx) => (
              <li key={tx.id}>
                Member ID: <strong>{tx.memberId}</strong> - P{tx.amount} pending approval
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending contributions at the moment.</p>
        )}
      </section>
    </main>
  )
}
