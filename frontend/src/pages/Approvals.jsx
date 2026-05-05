import { useState, useEffect } from 'react'
import API from '../api'

export default function Approvals() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Load pending transactions
  const fetchPending = async () => {
    try {
      const res = await API.get('/transactions?approved=false')
      setTransactions(res.data)
    } catch (err) {
      setError('Failed to load pending transactions.')
    }
  }

  useEffect(() => {
    fetchPending()
  }, [])

  const handleApprove = async (transactionId) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await API.post(`/transactions/${transactionId}/approve`)
      setSuccess(res.data.message)
      await fetchPending()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve transaction.')
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type) => {
    if (type === 'contribution') return '💰 Contribution'
    if (type === 'loan-request') return '🏦 Loan Request'
    if (type === 'loan-payment') return '💳 Loan Payment'
    return type
  }

  return (
    <main className="page-content">
      <section>
        <p className="eyebrow">Approvals</p>
        <h2>Pending signatory approvals</h2>
        <p className="intro-text">
          As a signatory, review and approve pending contributions, loan requests, and loan payments.
        </p>
      </section>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <section className="table-panel">
        {transactions.length ? (
          <ul className="action-list">
            {transactions.map((tx) => (
              <li key={tx.contribution_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{tx.member_name}</strong> — {getTypeLabel(tx.type || 'contribution')} —{' '}
                  P{tx.contribution_amount} —{' '}
                  {tx.contribution_month && <span>{tx.contribution_month} — </span>}
                  <span style={{ opacity: 0.6 }}>
                    {new Date(tx.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="button-primary"
                  onClick={() => handleApprove(tx.contribution_id)}
                  disabled={loading}
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending transactions at the moment.</p>
        )}
      </section>
    </main>
  )
}