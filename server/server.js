const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./db/database');
require('dotenv').config();

// Import routes
const companiesRoutes = require('./routes/companies');
const profileRoutes = require('./routes/profile');
const documentsRoutes = require('./routes/documents');

// Initialize storage
initializeDatabase();

// Create Express app
const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/companies', companiesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
