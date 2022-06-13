import express from 'express';
import {
  getUserToken,
  getItemToken,
  getTransactions,
} from '../methods';

// Declaration of API endpoints.

const router = express.Router();

router.post("/user-token", getUserToken);
router.post("/item-token", getItemToken);
router.post("/transactions", getTransactions);

module.exports = router;
