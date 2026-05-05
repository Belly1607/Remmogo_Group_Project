const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/error');

// GET /api/members?groupId=1
const getMembers = asyncHandler(async (req, res) => {
  const { groupId } = req.query;

  if (groupId) {
    const [rows] = await pool.query(
      'SELECT * FROM member WHERE group_id = ?',
      [groupId]
    );
    return res.json(rows);
  }

  const [rows] = await pool.query('SELECT * FROM member ORDER BY date_joined DESC');
  res.json(rows);
});

// GET /api/members/:id
const getMember = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM member WHERE member_id = ?',
    [req.params.id]
  );

  if (!rows[0]) {
    return res.status(404).json({ message: 'Member not found.' });
  }

  res.json(rows[0]);
});

// POST /api/members
const enrollMember = asyncHandler(async (req, res) => {
  const { member_name, phone, group_id } = req.body;

  if (!member_name || !group_id) {
    return res.status(400).json({ message: 'Member name and group ID are required.' });
  }

  // Check group exists
  const [groupCheck] = await pool.query(
    'SELECT group_id FROM motshelo_group WHERE group_id = ?',
    [group_id]
  );

  if (!groupCheck[0]) {
    return res.status(404).json({ message: 'Group not found.' });
  }

  // Check not already enrolled
  const [existing] = await pool.query(
    'SELECT member_id FROM member WHERE member_name = ? AND group_id = ?',
    [member_name, group_id]
  );

  if (existing[0]) {
    return res.status(409).json({ message: 'This member is already enrolled in this group.' });
  }

  const [result] = await pool.query(
    'INSERT INTO member (member_name, phone, group_id) VALUES (?, ?, ?)',
    [member_name, phone || null, group_id]
  );

  res.status(201).json({
    message: 'Member enrolled successfully.',
    member: {
      member_id: result.insertId,
      member_name,
      phone,
      group_id,
    },
  });
});

module.exports = { getMembers, getMember, enrollMember };