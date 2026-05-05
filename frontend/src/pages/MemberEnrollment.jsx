import { useState, useEffect } from 'react'
import API from '../api'

export default function MemberEnrollment({ onCreateMember }) {
  const [groups, setGroups] = useState([])
  const [groupId, setGroupId] = useState('')
  const [memberName, setMemberName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Load groups from backend when page opens
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await API.get('/groups')
        setGroups(response.data)
        if (response.data.length > 0) {
          setGroupId(response.data[0].group_id)
        }
      } catch (err) {
        setError('Failed to load groups.')
      }
    }
    fetchGroups()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!memberName.trim() || !groupId) {
      setError('Member name and group are required.')
      return
    }

    setLoading(true)

    try {
      const response = await API.post('/members', {
        member_name: memberName.trim(),
        phone: phone.trim(),
        group_id: groupId,
      })

      onCreateMember(response.data.member)
      setSuccess('Member enrolled successfully.')
      setMemberName('')
      setPhone('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll member. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-content page-form">
      <section>
        <p className="eyebrow">Enroll a member</p>
        <h2>Add a member to a group</h2>
        <p className="intro-text">
          Select a group and enter the member details to enroll them.
        </p>
      </section>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <label>
          Select group
          <select
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            required
          >
            <option value="">Choose group</option>
            {groups.map((group) => (
              <option key={group.group_id} value={group.group_id}>
                {group.group_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Member name
          <input
            value={memberName}
            onChange={(event) => setMemberName(event.target.value)}
            placeholder="Enter full name"
            required
          />
        </label>

        <label>
          Phone number
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="e.g. 71234567"
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="button-primary" disabled={loading || !groups.length}>
          {loading ? 'Enrolling...' : 'Enroll member'}
        </button>
      </form>
    </main>
  )
}