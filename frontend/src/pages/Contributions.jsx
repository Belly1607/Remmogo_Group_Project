import { useState, useEffect } from 'react'
import API from '../api'

export default function Contributions() {
  const [members, setMembers] = useState([])
  const [memberId, setMemberId] = useState('')
  const [month, setMonth] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState([])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Load members and pending contributions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersRes = await API.get('/members')
        setMembers(membersRes.data)
        if (membersRes.data.length > 0) {
          setMemberId(membersRes.data[0].member_id)
        }

        const txRes = await API.get('/transactions?approved=false')
        setPending(txRes.data)
      } catch (err) {
        setError('Failed to load data.')
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!memberId || !month) {
      setError('Please select a member and contribution month.')
      return
    }

    setLoading(true)

    try {
      await API.post('/transactions', {
        member_id: memberId,
        type: 'contribution',
        amount: 1000,
        contribution_month: month,
      })

      setSuccess('Contribution submitted. Awaiting signatory approval.')
      setMonth('')

      // Refresh pending list
      const txRes = await API.get('/transactions?approved=false')
      setPending(txRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit contribution.')
    } finally {
      setLoading(false)
    }
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
          Contribution month
          <select
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            required
          >
            <option value="">Choose month</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label>
          Amount (P)
          <input type="number" value={1000} disabled />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="button-primary" disabled={loading || !members.length}>
          {loading ? 'Submitting...' : 'Submit payment'}
        </button>
      </form>

      <section className="table-panel">
        <h3>Pending contributions</h3>
        {pending.length ? (
          <ul className="action-list">
            {pending.map((tx) => (
              <li key={tx.contribution_id}>
                <strong>{tx.member_name}</strong> — P{tx.contribution_amount} —{' '}
                {tx.contribution_month} — pending approval
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