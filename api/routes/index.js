import express from 'express';
import {
  getUserToken,
  getAccounts,
  exchangeForPublicToken,
  getTransactions,
} from '../methods';

// Declaration of API endpoints.

const router = express.Router();

router.post("/user-token", getUserToken);
router.post('/exchange-public-token', exchangeForPublicToken);
router.post('/accounts', getAccounts);
router.post("/transactions", getTransactions);

module.exports = router;
