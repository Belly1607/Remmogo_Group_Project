const router = require('express').Router();
const { getMembers, getMember, enrollMember } = require('../controllers/memberController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMembers);
router.get('/:id', protect, getMember);
router.post('/', protect, enrollMember);

module.exports = router;