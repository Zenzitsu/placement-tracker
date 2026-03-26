const express = require('express');
const { storage } = require('../db/database');
const router = express.Router();

// Get profile
router.get('/', (req, res) => {
  try {
    const profile = storage.profile.get();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update or create profile
router.put('/', (req, res) => {
  try {
    const { name, email, phone, portfolio } = req.body;

    const profile = storage.profile.update({
      id: 1,
      name: name || '',
      email: email || '',
      phone: phone || '',
      portfolio: portfolio || '',
      updatedAt: new Date().toISOString()
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
