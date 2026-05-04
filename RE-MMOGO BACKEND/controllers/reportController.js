const { asyncHandler } = require('../middleware/error');

// GET /api/reports/:groupId/year-end
const getYearEndReport = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const year = req.query.year || new Date().getFullYear();

  // We will replace this with real DB data later
  // For now we return a sample structure
  const mockMembers = [
    {
      id: 1,
      name: 'Member One',
      yearlyContributions: 12000,
      contributionCount: 12,
      totalLoansTaken: 5000,
      totalLoanPayments: 3000,
      currentLoanBalance: 2000,
      interestGenerated: 6000,
      metInterestTarget: true,
      payout: 0,
    },
    {
      id: 2,
      name: 'Member Two',
      yearlyContributions: 10000,
      contributionCount: 10,
      totalLoansTaken: 0,
      totalLoanPayments: 0,
      currentLoanBalance: 0,
      interestGenerated: 3000,
      metInterestTarget: false,
      payout: 0,
    },
  ];

  // Calculate group totals
  const totalContributions = mockMembers.reduce((s, m) => s + m.yearlyContributions, 0);
  const totalInterest = mockMembers.reduce((s, m) => s + m.interestGenerated, 0);
  const poolValue = totalContributions + totalInterest;
  const perMemberPayout = mockMembers.length ? poolValue / mockMembers.length : 0;

  // Rank by interest generated
  const ranked = [...mockMembers].sort((a, b) => b.interestGenerated - a.interestGenerated);

  // Add payout to each member
  const membersWithPayout = mockMembers.map((m) => ({
    ...m,
    payout: parseFloat(perMemberPayout.toFixed(2)),
  }));

  res.json({
    group: `Group ${groupId}`,
    year,
    summary: {
      totalContributions,
      totalInterest,
      poolValue,
      perMemberPayout: parseFloat(perMemberPayout.toFixed(2)),
      memberCount: mockMembers.length,
    },
    topContributor: ranked[0]?.name || null,
    leastContributor: ranked[ranked.length - 1]?.name || null,
    members: membersWithPayout,
  });
});

module.exports = { getYearEndReport };