const express = require('express');
const { storage } = require('../db/database');
const router = express.Router();

// Get all documents
router.get('/', (req, res) => {
  try {
    const documents = storage.documents.getAll();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new document
router.post('/', (req, res) => {
  try {
    const { name, type, size } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Please provide a document name' });
    }

    const document = storage.documents.create({
      name,
      type: type || '',
      size: size || ''
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
router.delete('/:id', (req, res) => {
  try {
    const document = storage.documents.getById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    storage.documents.delete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
