const { asyncHandler } = require('../middleware/error');

// Temporary storage until we connect the database
const transactions = [];
const members = require('./memberController');

// GET /api/transactions?groupId=1&type=contribution&approved=false
const getTransactions = asyncHandler(async (req, res) => {
  const { groupId, type, approved } = req.query;
  let result = [...transactions];

  if (groupId) {
    result = result.filter((t) => t.groupId === parseInt(groupId));
  }
  if (type) {
    result = result.filter((t) => t.type === type);
  }
  if (approved !== undefined) {
    result = result.filter((t) => t.approved === (approved === 'true'));
  }

  res.json(result);
});

// GET /api/transactions/:id
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = transactions.find((t) => t.id === parseInt(req.params.id));

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found.' });
  }

  res.json(transaction);
});

// POST /api/transactions
const createTransaction = asyncHandler(async (req, res) => {
  const { memberId, groupId, type, amount, notes } = req.body;

  if (!memberId || !groupId || !type || !amount) {
    return res.status(400).json({ message: 'memberId, groupId, type and amount are required.' });
  }

  const validTypes = ['contribution', 'loan-request', 'loan-payment'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
  }

  // Business rules
  if (type === 'contribution' && Number(amount) !== 1000) {
    return res.status(400).json({ message: 'Monthly contribution must be exactly P1000.' });
  }

  const newTransaction = {
    id: transactions.length + 1,
    memberId: parseInt(memberId),
    groupId: parseInt(groupId),
    type,
    amount: Number(amount),
    approved: false,
    approvals: [],
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction);

  res.status(201).json({
    message: 'Transaction submitted. Awaiting signatory approval.',
    transaction: newTransaction,
  });
});

// POST /api/transactions/:id/approve
const approveTransaction = asyncHandler(async (req, res) => {
  const transaction = transactions.find((t) => t.id === parseInt(req.params.id));

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found.' });
  }

  if (transaction.approved) {
    return res.status(400).json({ message: 'Transaction already approved.' });
  }

  // Check this signatory hasnt already approved
  if (transaction.approvals.includes(req.user.username)) {
    return res.status(400).json({ message: 'You have already approved this transaction.' });
  }

  // Record this signatories approval
  transaction.approvals.push(req.user.username);

  // Need 2 approvals before marking as fully approved
  if (transaction.approvals.length >= 2) {
    transaction.approved = true;
    transaction.approvedAt = new Date().toISOString();
    transaction.approvedBy = req.user.username;

    return res.json({
      message: 'Transaction fully approved!',
      approvals: transaction.approvals.length,
      transaction,
    });
  }

  res.json({
    message: `Approval recorded (${transaction.approvals.length}/2). Awaiting second signatory.`,
    approvals: transaction.approvals.length,
    transaction,
  });
});

module.exports = { getTransactions, getTransaction, createTransaction, approveTransaction };