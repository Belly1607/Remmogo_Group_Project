const router = require('express').Router();
const { getGroups, getGroup, createGroup } = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getGroups);
router.get('/:id', protect, getGroup);
router.post('/', protect, createGroup);

module.exports = router;