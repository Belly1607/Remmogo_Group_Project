const { asyncHandler } = require('../middleware/error');

// Temporary storage until we connect the database
const members = [];

// GET /api/members?groupId=1
const getMembers = asyncHandler(async (req, res) => {
  const { groupId } = req.query;

  if (groupId) {
    const filtered = members.filter((m) => m.groupId === parseInt(groupId));
    return res.json(filtered);
  }

  res.json(members);
});

// GET /api/members/:id
const getMember = asyncHandler(async (req, res) => {
  const member = members.find((m) => m.id === parseInt(req.params.id));

  if (!member) {
    return res.status(404).json({ message: 'Member not found.' });
  }

  res.json(member);
});

// POST /api/members
const enrollMember = asyncHandler(async (req, res) => {
  const { fullName, phone, groupId } = req.body;

  if (!fullName || !groupId) {
    return res.status(400).json({ message: 'Full name and group ID are required.' });
  }

  // Check member not already enrolled in this group
  const existing = members.find(
    (m) => m.fullName.toLowerCase() === fullName.toLowerCase() && m.groupId === parseInt(groupId)
  );

  if (existing) {
    return res.status(409).json({ message: 'This member is already enrolled in this group.' });
  }

  const newMember = {
    id: members.length + 1,
    fullName,
    phone: phone || '',
    groupId: parseInt(groupId),
    totalContributions: 0,
    loanBalance: 0,
    interestRaised: 0,
    enrolledAt: new Date().toISOString(),
  };

  members.push(newMember);

  res.status(201).json({
    message: 'Member enrolled successfully.',
    member: newMember,
  });
});

module.exports = { getMembers, getMember, enrollMember };