const { asyncHandler } = require('../middleware/error');

// Temporary storage until we connect the database
const groups = [];

// GET /api/groups
const getGroups = asyncHandler(async (req, res) => {
  res.json(groups);
});

// GET /api/groups/:id
const getGroup = asyncHandler(async (req, res) => {
  const group = groups.find((g) => g.id === parseInt(req.params.id));

  if (!group) {
    return res.status(404).json({ message: 'Group not found.' });
  }

  res.json(group);
});

// POST /api/groups
const createGroup = asyncHandler(async (req, res) => {
  const { name, description, signatoryOne, signatoryTwo } = req.body;

  if (!name || !signatoryOne || !signatoryTwo) {
    return res.status(400).json({ message: 'Group name and two signatories are required.' });
  }

  if (signatoryOne.toLowerCase() === signatoryTwo.toLowerCase()) {
    return res.status(400).json({ message: 'Both signatories must be different people.' });
  }

  const newGroup = {
    id: groups.length + 1,
    name,
    description: description || '',
    signatories: [signatoryOne, signatoryTwo],
    createdBy: req.user.username,
    createdAt: new Date().toISOString(),
    memberCount: 0,
  };

  groups.push(newGroup);

  res.status(201).json({
    message: 'Group registered successfully.',
    group: newGroup,
  });
});

module.exports = { getGroups, getGroup, createGroup };