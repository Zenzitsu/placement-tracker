# Placement Tracker Backend Setup Guide

This project now includes both a React frontend and an Express.js backend with SQLite database integration.

## Project Structure

```
placement-tracker/
├── server/                 # Backend Express.js app
│   ├── db/
│   │   └── database.js    # SQLite database setup
│   ├── routes/
│   │   ├── companies.js   # API routes for companies
│   │   ├── profile.js     # API routes for user profile
│   │   └── documents.js   # API routes for documents
│   └── server.js          # Main Express server
├── src/                   # React frontend
│   ├── pages/
│   │   ├── CompanyTracker.js
│   │   └── Profile.js
│   ├── components/
│   ├── App.js
│   └── index.js
├── package.json           # Dependencies for both frontend and backend
└── README.md
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```
   
   This installs both frontend (React) and backend (Express) dependencies.

## Running the Application

### Option 1: Development Mode (Recommended - Runs Both Frontend and Backend)
```bash
npm run dev
```
This command uses `concurrently` to run both the backend server and frontend development server:
- Backend server: http://localhost:5000
- Frontend app: http://localhost:3000

### Option 2: Run Backend Only
```bash
npm run start-backend
```
Starts the Express server on http://localhost:5000

### Option 3: Run Frontend Only
```bash
npm start
```
Starts the React development server on http://localhost:3000 (requires backend running separately)

## API Endpoints

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get a specific company
- `POST /api/companies` - Add a new company
- `PUT /api/companies/:id` - Update a company
- `DELETE /api/companies/:id` - Delete a company

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update or create user profile

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Add a new document reference
- `DELETE /api/documents/:id` - Delete a document reference

## Database

The application uses SQLite with the following tables:

### companies
- id (INTEGER, PRIMARY KEY)
- name (TEXT, NOT NULL)
- role (TEXT, NOT NULL)
- dueDate (TEXT, NOT NULL)
- status (TEXT, DEFAULT: 'Interested')
- createdAt (DATETIME)

### profile
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- email (TEXT)
- phone (TEXT)
- portfolio (TEXT)
- updatedAt (DATETIME)

### documents
- id (INTEGER, PRIMARY KEY)
- name (TEXT, NOT NULL)
- type (TEXT)
- size (TEXT)
- createdAt (DATETIME)

The database file (`tracker.db`) is automatically created in the `server/db/` directory on first run.

## Frontend Integration

The React components have been updated to make API calls instead of using localStorage:

### CompanyTracker Component
- Fetches all companies on mount
- Creates, updates, and deletes companies via API
- Shows loading and error states

### Profile Component
- Fetches profile and documents on mount
- Saves profile changes in real-time
- Manages document references through API

## Features

✅ Full CRUD operations for companies  
✅ User profile management  
✅ Document reference tracking  
✅ Real-time database persistence  
✅ Error handling and loading states  
✅ CORS enabled for frontend-backend communication  
✅ SQLite database with automatic initialization  

## Environment Variables

Create a `.env` file in the `server/` directory (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
```

## Troubleshooting

### Backend not connecting
- Ensure the backend server is running on port 5000
- Check that `npm run dev` is being used or backend is running with `npm run start-backend`
- Verify no other service is using port 5000

### Database errors
- Delete `server/db/tracker.db` to reset the database
- Ensure `better-sqlite3` is installed correctly: `npm install better-sqlite3`

### Port already in use
- Change the PORT in `.env` file
- Or kill the process using the port

## Building for Production

```bash
npm run build
```

This creates a production-ready build of the React frontend in the `build/` directory.

## Future Enhancements

- Authentication and user accounts
- Real-time notifications for deadlines
- Interview preparations tracking
- Integration with email notifications
- Backup and export features
