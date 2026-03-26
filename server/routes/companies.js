const express = require('express');
const { storage } = require('../db/database');
const router = express.Router();

// Get all companies
router.get('/', (req, res) => {
  try {
    const companies = storage.companies.getAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single company by ID
router.get('/:id', (req, res) => {
  try {
    const company = storage.companies.getById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new company
router.post('/', (req, res) => {
  try {
    const { name, role, dueDate, status } = req.body;

    if (!name || !role || !dueDate) {
      return res.status(400).json({ error: 'Please provide name, role, and dueDate' });
    }

    const company = storage.companies.create({
      name,
      role,
      dueDate,
      status: status || 'Interested'
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a company
router.put('/:id', (req, res) => {
  try {
    const { name, role, dueDate, status } = req.body;

    const company = storage.companies.update(req.params.id, {
      ...(name && { name }),
      ...(role && { role }),
      ...(dueDate && { dueDate }),
      ...(status && { status })
    });

    res.json(company);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete a company
router.delete('/:id', (req, res) => {
  try {
    const company = storage.companies.getById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    storage.companies.delete(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
