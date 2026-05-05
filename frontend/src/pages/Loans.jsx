import { useState, useEffect } from 'react'
import API from '../api'

export default function Loans() {
  const [members, setMembers] = useState([])
  const [memberId, setMemberId] = useState('')
  const [loanAmount, setLoanAmount] = useState(1000)
  const [paymentAmount, setPaymentAmount] = useState(1000)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingLoans, setPendingLoans] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])

  const selectedMember = members.find((m) => m.member_id === parseInt(memberId))
  const monthlyInterest = selectedMember ? Math.round(selectedMember.loan_balance * 0.2) : 0

  // Load members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersRes = await API.get('/members')
        setMembers(membersRes.data)
        if (membersRes.data.length > 0) {
          setMemberId(membersRes.data[0].member_id)
        }

        const loanRes = await API.get('/transactions?type=loan-request&approved=false')
        setPendingLoans(loanRes.data)

        const payRes = await API.get('/transactions?type=loan-payment&approved=false')
        setPendingPayments(payRes.data)
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }
    fetchData()
  }, [])

  const refreshPending = async () => {
    const loanRes = await API.get('/transactions?type=loan-request&approved=false')
    setPendingLoans(loanRes.data)
    const payRes = await API.get('/transactions?type=loan-payment&approved=false')
    setPendingPayments(payRes.data)
  }

  const handleLoanRequest = async (event) => {
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

    setLoading(true)
    try {
      await API.post('/transactions', {
        member_id: memberId,
        type: 'loan-request',
        amount: loanAmount,
      })
      setSuccess('Loan request submitted. Awaiting signatory approval.')
      await refreshPending()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit loan request.')
    } finally {
      setLoading(false)
    }
  }

  const handleLoanPayment = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!memberId) {
      setError('Select a member to record a loan payment.')
      return
    }

    if (!selectedMember || selectedMember.loan_balance <= 0) {
      setError('Selected member has no outstanding loan balance.')
      return
    }

    setLoading(true)
    try {
      await API.post('/transactions', {
        member_id: memberId,
        type: 'loan-payment',
        amount: paymentAmount,
      })
      setSuccess('Loan payment initiated. Awaiting signatory approval.')
      await refreshPending()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit loan payment.')
    } finally {
      setLoading(false)
    }
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
          <h3>Request a loan</h3>
          <label>
            Select member
            <select
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              required
            >
              <option value="">Choose member</option>
              {members.map((member) => (
                <option key={member.member_id} value={member.member_id}>
                  {member.member_name}
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

          <button type="submit" className="button-secondary" disabled={loading || !members.length}>
            {loading ? 'Submitting...' : 'Request loan'}
          </button>
        </form>

        <form className="form-grid" onSubmit={handleLoanPayment} noValidate>
          <h3>Make a loan payment</h3>
          <label>
            Select member
            <select
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              required
            >
              <option value="">Choose member</option>
              {members.map((member) => (
                <option key={member.member_id} value={member.member_id}>
                  {member.member_name}
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

          <button type="submit" className="button-primary" disabled={loading || !members.length}>
            {loading ? 'Submitting...' : 'Initiate payment'}
          </button>
        </form>
      </div>

      {selectedMember && (
        <section className="info-panel">
          <h3>{selectedMember.member_name}</h3>
          <p>Outstanding loan balance: P{selectedMember.loan_balance?.toLocaleString()}</p>
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
                <li key={tx.contribution_id}>
                  <strong>{tx.member_name}</strong> — P{tx.contribution_amount}
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
                <li key={tx.contribution_id}>
                  <strong>{tx.member_name}</strong> — P{tx.contribution_amount}
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