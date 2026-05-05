import { useState } from 'react'
import API from '../api'

export default function GroupRegistration({ onCreateGroup }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [signatoryOne, setSignatoryOne] = useState('')
  const [signatoryTwo, setSignatoryTwo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim() || !description.trim() || !signatoryOne.trim() || !signatoryTwo.trim()) {
      setError('All fields are required, including both signatories.')
      return
    }

    if (signatoryOne.trim().toLowerCase() === signatoryTwo.trim().toLowerCase()) {
      setError('Please add two different signatories for the group.')
      return
    }

    setLoading(true)

    try {
      const response = await API.post('/groups', {
        group_name: name.trim(),
        description: description.trim(),
        signatoryOne: signatoryOne.trim(),
        signatoryTwo: signatoryTwo.trim(),
      })

      onCreateGroup(response.data.group)
      setSuccess('Group registered successfully.')
      setName('')
      setDescription('')
      setSignatoryOne('')
      setSignatoryTwo('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register group. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-content page-form">
      <section>
        <p className="eyebrow">Register a new group</p>
        <h2>Create a motshelo group</h2>
        <p className="intro-text">
          Each motshelo group must have two signatories. The app will use this group to enroll members and track contributions.
        </p>
      </section>

      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <label>
          Group name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Re-Mmogo Circle"
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe this motshelo group"
            rows="4"
            required
          />
        </label>

        <label>
          First signatory
          <input
            value={signatoryOne}
            onChange={(event) => setSignatoryOne(event.target.value)}
            placeholder="First approver"
            required
          />
        </label>

        <label>
          Second signatory
          <input
            value={signatoryTwo}
            onChange={(event) => setSignatoryTwo(event.target.value)}
            placeholder="Second approver"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register group'}
        </button>
      </form>
    </main>
  )
}