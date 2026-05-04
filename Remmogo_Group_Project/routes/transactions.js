const router = require('express').Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  approveTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransaction);
router.post('/', protect, createTransaction);
router.post('/:id/approve', protect, approveTransaction);

module.exports = router;