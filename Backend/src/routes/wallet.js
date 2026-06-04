const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All wallet routes require authentication
router.use(authenticateToken);

// Specific routes must come before parameterized routes
router.get('/portfolio/summary', walletController.getPortfolioSummary);

router.get('/', walletController.getWallets);
router.post('/', walletController.addWallet);

router.put('/:id/default', walletController.setDefaultWallet);
router.get('/:id/balances', walletController.getWalletBalances);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);

module.exports = router;
