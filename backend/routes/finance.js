const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// All finance routes require authentication
router.use(authMiddleware);

// --- Transactions ---

// Get all transactions for the user
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new transaction
router.post('/transactions', async (req, res) => {
  try {
    const { description, amount, date, type, category } = req.body;

    const newTransaction = new Transaction({
      userId: req.user.userId,
      description,
      amount,
      date,
      type,
      category,
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a transaction
router.delete('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure user owns transaction
    if (transaction.userId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(500).send('Server Error');
  }
});

// --- Budget ---

// Get budget limit
router.get('/budget', async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user.userId });
    if (!budget) {
      // Return default 0 if not set
      return res.json({ limit: 0 });
    }
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update budget limit
router.put('/budget', async (req, res) => {
  try {
    const { limit } = req.body;

    let budget = await Budget.findOne({ userId: req.user.userId });

    if (budget) {
      // Update existing
      budget.limit = limit;
      await budget.save();
      return res.json(budget);
    }

    // Create new
    budget = new Budget({
      userId: req.user.userId,
      limit,
    });

    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
