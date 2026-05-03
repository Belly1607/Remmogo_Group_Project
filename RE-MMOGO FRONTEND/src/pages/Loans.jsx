import { useState } from 'react'

export default function Loans({ members, onCreateTransaction, transactions }) {
  const [memberId, setMemberId] = useState(members[0]?.id || '')
  const [loanAmount, setLoanAmount] = useState(1000)
  const [paymentAmount, setPaymentAmount] = useState(1000)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const pendingLoans = transactions.filter((tx) => tx.type === 'loan-request' && !tx.approved)
  const pendingPayments = transactions.filter((tx) => tx.type === 'loan-payment' && !tx.approved)

  const selectedMember = members.find((member) => member.id === memberId)
  const monthlyInterest = selectedMember ? Math.round(selectedMember.loanBalance * 0.2) : 0

  const handleLoanRequest = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!memberId) {
      setError('Select a member to request a loan.')
      return
    }

    if (loanAmount < 1000) {
      setError('Loan amount must be at least P1000.')
      return
    }

    const tx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      memberId,
      type: 'loan-request',
      amount: loanAmount,
      approved: false,
      createdAt: new Date().toISOString(),
    }

    onCreateTransaction(tx)
    setSuccess('Loan request is waiting for signatory approval.')
  }

  const handleLoanPayment = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!memberId) {
      setError('Select a member to record a loan payment.')
      return
    }

    if (!selectedMember || selectedMember.loanBalance <= 0) {
      setError('Selected member has no outstanding loan balance.')
      return
    }

    if (paymentAmount <= 0 || paymentAmount > selectedMember.loanBalance) {
      setError('Payment must be less than or equal to the current loan balance.')
      return
    }

    const tx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      memberId,
      type: 'loan-payment',
      amount: paymentAmount,
      approved: false,
      createdAt: new Date().toISOString(),
    }

    onCreateTransaction(tx)
    setSuccess('Loan payment initiated and waiting for signatory approval.')
  }

  return (
    <main className="page-content page-form">
      <section>
        <p className="eyebrow">Loans and payments</p>
        <h2>Request loans or record loan payments</h2>
        <p className="intro-text">
          Only group members can borrow. Loan disbursements and payments are recorded after signatory approval.
        </p>
      </section>

      <div className="split-grid">
        <form className="form-grid" onSubmit={handleLoanRequest} noValidate>
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
            Loan amount (P)
            <input
              type="number"
              value={loanAmount}
              onChange={(event) => setLoanAmount(Number(event.target.value))}
              min="1000"
              required
            />
          </label>

          <button type="submit" className="button-secondary" disabled={!members.length}>
            Request loan
          </button>
        </form>

        <form className="form-grid" onSubmit={handleLoanPayment} noValidate>
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
            Payment amount (P)
            <input
              type="number"
              value={paymentAmount}
              onChange={(event) => setPaymentAmount(Number(event.target.value))}
              min="1"
              required
            />
          </label>

          <button type="submit" className="button-primary" disabled={!members.length}>
            Initiate payment
          </button>
        </form>
      </div>

      {selectedMember && (
        <section className="info-panel">
          <h3>{selectedMember.name}</h3>
          <p>Outstanding loan balance: P{selectedMember.loanBalance.toLocaleString()}</p>
          <p>Estimated monthly interest: P{monthlyInterest.toLocaleString()}</p>
        </section>
      )}

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <section className="table-panel">
        <div>
          <h3>Pending loan requests</h3>
          {pendingLoans.length ? (
            <ul className="action-list">
              {pendingLoans.map((tx) => (
                <li key={tx.id}>
                  {tx.memberId}: Request P{tx.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending loan requests.</p>
          )}
        </div>

        <div>
          <h3>Pending loan payments</h3>
          {pendingPayments.length ? (
            <ul className="action-list">
              {pendingPayments.map((tx) => (
                <li key={tx.id}>
                  {tx.memberId}: Payment P{tx.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No pending loan payments.</p>
          )}
        </div>
      </section>
    </main>
  )
}
