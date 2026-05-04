import { useState } from 'react'

export default function MemberEnrollment({ groups, onCreateMember }) {
  const [groupId, setGroupId] = useState(groups[0]?.id || '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!groupId) {
      setError('Please select a group before enrolling a member.')
      return
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('All member fields are required.')
      return
    }

    const member = {
      id: `member-${Date.now()}`,
      groupId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      totalContributions: 0,
      loanBalance: 0,
      createdAt: new Date().toISOString(),
    }

    onCreateMember(member)
    setSuccess('Member enrolled successfully.')
    setName('')
    setEmail('')
    setPhone('')
  }

  return (
    <main className="page-content page-form">
      <section>
        <p className="eyebrow">Enroll a member</p>
        <h2>Add a new motshelo member</h2>
      </section>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <label>
          Select group
          <select value={groupId} onChange={(event) => setGroupId(event.target.value)} required>
            <option value="">Choose group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Member name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Member full name"
            required
          />
        </label>

        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="member@example.com"
            required
          />
        </label>

        <label>
          Phone number
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="078 123 4567"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="button-primary">
          Enroll member
        </button>
      </form>
    </main>
  )
}
