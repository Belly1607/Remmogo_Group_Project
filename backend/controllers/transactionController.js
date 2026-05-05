const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/error');

// GET /api/transactions
const getTransactions = asyncHandler(async (req, res) => {
  const { groupId, type, approved } = req.query;

  let query = `
    SELECT t.*, m.member_name
    FROM contribution t
    JOIN member m ON m.member_id = t.member_id
    WHERE 1=1
  `;
  const params = [];

  if (groupId) {
    query += ' AND m.group_id = ?';
    params.push(groupId);
  }
  if (approved !== undefined) {
    query += ' AND t.approved = ?';
    params.push(approved === 'true' ? 1 : 0);
  }

  query += ' ORDER BY t.created_at DESC';

  const [rows] = await pool.query(query, params);
  res.json(rows);
});

// GET /api/transactions/:id
const getTransaction = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM contribution WHERE contribution_id = ?',
    [req.params.id]
  );

  if (!rows[0]) {
    return res.status(404).json({ message: 'Transaction not found.' });
  }

  res.json(rows[0]);
});

// POST /api/transactions
const createTransaction = asyncHandler(async (req, res) => {
  const { member_id, type, amount, contribution_month, notes } = req.body;

  if (!member_id || !type || !amount) {
    return res.status(400).json({ message: 'member_id, type and amount are required.' });
  }

  const validTypes = ['contribution', 'loan-request', 'loan-payment'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: `Type must be one of: ${validTypes.join(', ')}` });
  }

  if (type === 'contribution' && Number(amount) !== 1000) {
    return res.status(400).json({ message: 'Monthly contribution must be exactly P1000.' });
  }

  const [result] = await pool.query(
    'INSERT INTO contribution (member_id, contribution_amount, contribution_month) VALUES (?, ?, ?)',
    [member_id, amount, contribution_month || null]
  );

  res.status(201).json({
    message: 'Transaction submitted. Awaiting signatory approval.',
    transaction: {
      contribution_id: result.insertId,
      member_id,
      contribution_amount: amount,
      contribution_month,
      approved: false,
    },
  });
});

// POST /api/transactions/:id/approve
const approveTransaction = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM contribution WHERE contribution_id = ?',
    [req.params.id]
  );

  const transaction = rows[0];

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found.' });
  }

  if (transaction.approved) {
    return res.status(400).json({ message: 'Transaction already approved.' });
  }

  await pool.query(
    'UPDATE contribution SET approved = 1 WHERE contribution_id = ?',
    [req.params.id]
  );

  // Update member total contributions
  await pool.query(
    'UPDATE member SET total_contributions = total_contributions + ? WHERE member_id = ?',
    [transaction.contribution_amount, transaction.member_id]
  );

  res.json({ message: 'Transaction approved successfully.' });
});

module.exports = { getTransactions, getTransaction, createTransaction, approveTransaction };
