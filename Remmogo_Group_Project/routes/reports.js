const router = require('express').Router();
const { getYearEndReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/:groupId/year-end', protect, getYearEndReport);

module.exports = router;