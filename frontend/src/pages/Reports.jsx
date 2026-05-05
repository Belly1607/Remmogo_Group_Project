import { useState, useEffect } from 'react'
import API from '../api'

export default function Reports() {
  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await API.get('/groups')
        setGroups(res.data)
        if (res.data.length > 0) {
          setGroupId(res.data[0].group_id)
        }
      } catch (err) {
        setError('Failed to load groups.')
      }
    }
    fetchGroups()
  }, [])

  const handleGenerateReport = async () => {
    if (!groupId) {
      setError('Please select a group.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await API.get(`/reports/${groupId}/year-end?year=${year}`)
      setReport(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-content">
      <section>
        <p className="eyebrow">Year-end reports</p>
        <h2>Generate group report</h2>
        <p className="intro-text">
          View each member's contributions, loans, interest generated and year-end payout.
        </p>
      </section>

      <div className="form-grid" style={{ maxWidth: '500px' }}>
        <label>
          Select group
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">Choose group</option>
            {groups.map((g) => (
              <option key={g.group_id} value={g.group_id}>
                {g.group_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2020"
            max="2099"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button
          className="button-primary"
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate report'}
        </button>
      </div>

      {report && (
        <section className="table-panel" style={{ marginTop: '2rem' }}>
          <h3>{report.group} — {report.year} Year-End Report</h3>

          <div className="summary-grid" style={{ marginBottom: '1.5rem' }}>
            <article className="summary-card">
              <h3>Pool value</h3>
              <p>P{report.summary.poolValue?.toLocaleString()}</p>
            </article>
            <article className="summary-card">
              <h3>Per member payout</h3>
              <p>P{report.summary.perMemberPayout?.toLocaleString()}</p>
            </article>
            <article className="summary-card">
              <h3>Total interest</h3>
              <p>P{report.summary.totalInterest?.toLocaleString()}</p>
            </article>
          </div>

          <p>🏆 Top contributor: <strong>{report.topContributor}</strong></p>
          <p>📉 Least contributor: <strong>{report.leastContributor}</strong></p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Member</th>
                <th style={{ padding: '8px' }}>Contributions</th>
                <th style={{ padding: '8px' }}>Loans Taken</th>
                <th style={{ padding: '8px' }}>Loan Balance</th>
                <th style={{ padding: '8px' }}>Interest</th>
                <th style={{ padding: '8px' }}>Met Target</th>
                <th style={{ padding: '8px' }}>Payout</th>
              </tr>
            </thead>
            <tbody>
              {report.members.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{m.name}</td>
                  <td style={{ padding: '8px' }}>P{m.yearlyContributions?.toLocaleString()}</td>
                  <td style={{ padding: '8px' }}>P{m.totalLoansTaken?.toLocaleString()}</td>
                  <td style={{ padding: '8px' }}>P{m.currentLoanBalance?.toLocaleString()}</td>
                  <td style={{ padding: '8px' }}>P{m.interestGenerated?.toLocaleString()}</td>
                  <td style={{ padding: '8px' }}>{m.metInterestTarget ? '✅' : '❌'}</td>
                  <td style={{ padding: '8px' }}>P{m.payout?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  )
}