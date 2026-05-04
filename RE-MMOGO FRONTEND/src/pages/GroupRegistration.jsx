import { useState } from 'react'

export default function GroupRegistration({ onCreateGroup }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [signatoryOne, setSignatoryOne] = useState('')
  const [signatoryTwo, setSignatoryTwo] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (event) => {
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

    const group = {
      id: `group-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      signatories: [signatoryOne.trim(), signatoryTwo.trim()],
      createdAt: new Date().toISOString(),
    }

    onCreateGroup(group)
    setSuccess('Group registered successfully.')
    setName('')
    setDescription('')
    setSignatoryOne('')
    setSignatoryTwo('')
  }

  return (
    <main className="page-content page-form">
      <section>
        <p className="eyebrow">Register a new group</p>
        <h2>Create a motshelo group</h2>

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

        <button type="submit" className="button-primary">
          Register group
        </button>
      </form>
    </main>
  )
}
