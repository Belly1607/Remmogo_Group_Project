const router = require('express').Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, transactionController.getTransactions);
router.get('/:id', protect, transactionController.getTransaction);
router.post('/', protect, transactionController.createTransaction);
router.post('/:id/approve', protect, transactionController.approveTransaction);

module.exports = router;