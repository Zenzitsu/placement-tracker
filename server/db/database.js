const fs = require('fs');
const path = require('path');

// Data storage directory
const dataDir = path.join(__dirname, 'data');

// Ensure data directory exists
const initializeDatabase = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  console.log('Data storage initialized successfully');
};

// Helper functions to read/write JSON files (simulating localStorage)
const getStorageFile = (key) => path.join(dataDir, `${key}.json`);

const getFromStorage = (key) => {
  try {
    const filePath = getStorageFile(key);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
  }
  return null;
};

const saveToStorage = (key, data) => {
  try {
    const filePath = getStorageFile(key);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
    throw err;
  }
};

// API storage object with methods similar to database operations
const storage = {
  companies: {
    getAll: () => getFromStorage('companies') || [],
    create: (company) => {
      const companies = storage.companies.getAll();
      const newCompany = {
        id: Date.now(),
        ...company,
        createdAt: new Date().toISOString()
      };
      companies.push(newCompany);
      saveToStorage('companies', companies);
      return newCompany;
    },
    update: (id, updates) => {
      const companies = storage.companies.getAll();
      const index = companies.findIndex(c => c.id == id);
      if (index === -1) throw new Error('Company not found');
      companies[index] = { ...companies[index], ...updates };
      saveToStorage('companies', companies);
      return companies[index];
    },
    delete: (id) => {
      const companies = storage.companies.getAll();
      const filtered = companies.filter(c => c.id != id);
      saveToStorage('companies', filtered);
    },
    getById: (id) => {
      const companies = storage.companies.getAll();
      return companies.find(c => c.id == id);
    }
  },
  profile: {
    get: () => getFromStorage('profile') || { id: 1, name: '', email: '', phone: '', portfolio: '' },
    update: (profileData) => {
      saveToStorage('profile', profileData);
      return profileData;
    }
  },
  documents: {
    getAll: () => getFromStorage('documents') || [],
    create: (doc) => {
      const documents = storage.documents.getAll();
      const newDoc = {
        id: Date.now(),
        ...doc,
        createdAt: new Date().toISOString()
      };
      documents.push(newDoc);
      saveToStorage('documents', documents);
      return newDoc;
    },
    delete: (id) => {
      const documents = storage.documents.getAll();
      const filtered = documents.filter(d => d.id != id);
      saveToStorage('documents', filtered);
    },
    getById: (id) => {
      const documents = storage.documents.getAll();
      return documents.find(d => d.id == id);
    }
  }
};

module.exports = { storage, initializeDatabase };
