import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SiteHeader from './components/SiteHeader.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GroupRegistration from './pages/GroupRegistration.jsx'
import MemberEnrollment from './pages/MemberEnrollment.jsx'
import Contributions from './pages/Contributions.jsx'
import Loans from './pages/Loans.jsx'
import Approvals from './pages/Approvals.jsx'
import Reports from './pages/Reports.jsx'
import Login from './pages/Login.jsx'

const initialGroups = [
  {
    id: 'group-1',
    name: 'Re-Mmogo Circle',
    description: 'A community motshelo group with two signatories.',
    signatories: ['Mpho', 'Naledi'],
    createdAt: new Date().toISOString(),
  },
]

function App() {
  const [groups, setGroups] = useState(initialGroups)
  const [members, setMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [user, setUser] = useState(null)

  const addGroup = (group) => setGroups((current) => [...current, group])
  const addMember = (member) => setMembers((current) => [...current, member])
  const addTransaction = (transaction) => setTransactions((current) => [...current, transaction])

  const approveTransaction = (transactionId) => {
    const transaction = transactions.find((tx) => tx.id === transactionId)
    if (!transaction || transaction.approved) return

    setMembers((current) =>
      current.map((member) => {
        if (member.id !== transaction.memberId) return member

        if (transaction.type === 'contribution') {
          return {
            ...member,
            totalContributions: member.totalContributions + transaction.amount,
          }
        }

        if (transaction.type === 'loan-request') {
          return {
            ...member,
            loanBalance: member.loanBalance + transaction.amount,
          }
        }

        if (transaction.type === 'loan-payment') {
          return {
            ...member,
            loanBalance: Math.max(0, member.loanBalance - transaction.amount),
          }
        }

        return member
      }),
    )

    setTransactions((current) =>
      current.map((tx) =>
        tx.id === transactionId
          ? { ...tx, approved: true, approvedAt: new Date().toISOString() }
          : tx,
      ),
    )
  }

  const handleLogin = (newUser) => setUser(newUser)
  const handleLogout = () => setUser(null)

  const protectedElement = (element) => (user ? element : <Navigate to="/login" replace />)

  return (
    <BrowserRouter>
      <div className={user ? 'app-shell' : 'auth-shell'}>
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        {user && <SiteHeader user={user} onLogout={handleLogout} />}
        <div className={user ? 'content-area' : 'auth-content'}>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route path="/" element={protectedElement(<Dashboard groups={groups} members={members} transactions={transactions} />)} />
            <Route path="/register-group" element={protectedElement(<GroupRegistration onCreateGroup={addGroup} />)} />
            <Route path="/enroll-member" element={protectedElement(<MemberEnrollment groups={groups} onCreateMember={addMember} />)} />
            <Route
              path="/contributions"
              element={protectedElement(<Contributions members={members} transactions={transactions} onCreateTransaction={addTransaction} />)}
            />
            <Route path="/loans" element={protectedElement(<Loans members={members} transactions={transactions} onCreateTransaction={addTransaction} />)} />
            <Route
              path="/approvals"
              element={protectedElement(
                <Approvals
                  transactions={transactions}
                  members={members}
                  groups={groups}
                  onApproveTransaction={approveTransaction}
                />
              )}
            />
            <Route path="/reports" element={protectedElement(<Reports members={members} />)} />
            <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
