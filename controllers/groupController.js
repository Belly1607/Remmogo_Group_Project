const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/error');

// GET /api/groups
const getGroups = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT 
      g.group_id, g.group_name, g.description, g.date_created, g.status,
      COUNT(DISTINCT m.member_id) AS member_count
    FROM motshelo_group g
    LEFT JOIN member m ON m.group_id = g.group_id
    GROUP BY g.group_id
    ORDER BY g.date_created DESC
  `);
  res.json(rows);
});

// GET /api/groups/:id
const getGroup = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM motshelo_group WHERE group_id = ?',
    [req.params.id]
  );

  if (!rows[0]) {
    return res.status(404).json({ message: 'Group not found.' });
  }

  // Get signatories for this group
  const [signatories] = await pool.query(`
    SELECT s.signatory_id, m.member_name, m.member_id
    FROM signatory s
    JOIN member m ON m.member_id = s.member_id
    WHERE s.group_id = ?
  `, [req.params.id]);

  res.json({ ...rows[0], signatories });
});

// POST /api/groups
const createGroup = asyncHandler(async (req, res) => {
  const { group_name, description, signatoryOne, signatoryTwo } = req.body;

  if (!group_name || !signatoryOne || !signatoryTwo) {
    return res.status(400).json({ message: 'Group name and two signatories are required.' });
  }

  if (signatoryOne.toLowerCase() === signatoryTwo.toLowerCase()) {
    return res.status(400).json({ message: 'Both signatories must be different people.' });
  }

  const [result] = await pool.query(
    'INSERT INTO motshelo_group (group_name, description) VALUES (?, ?)',
    [group_name, description || '']
  );

  res.status(201).json({
    message: 'Group registered successfully.',
    group: {
      group_id: result.insertId,
      group_name,
      description,
      signatories: [signatoryOne, signatoryTwo],
    },
  });
});

module.exports = { getGroups, getGroup, createGroup };