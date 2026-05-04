const router = require('express').Router();
const groupController = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

router.get('/', protect, groupController.getGroups);
router.get('/:id', protect, groupController.getGroup);
router.post('/', protect, groupController.createGroup);

module.exports = router;