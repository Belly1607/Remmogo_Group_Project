const router = require('express').Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/:groupId/year-end', protect, reportController.getYearEndReport);

module.exports = router;