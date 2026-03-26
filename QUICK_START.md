# Quick Start Guide - Backend Integration

## Installation & Setup

### 1. Install All Dependencies
```bash
npm install
```

### 2. Start the Application
For development (runs both frontend and backend):
```bash
npm run dev
```

This will automatically start:
- ✅ Backend API on `http://localhost:5000`
- ✅ Frontend React App on `http://localhost:3000`

### 3. That's It!
Your placement tracker will now:
- Store all data in a SQLite database on the backend
- Make API calls instead of using localStorage
- Show loading states while fetching data
- Display errors if something goes wrong

## What Changed

### Frontend Changes
- **CompanyTracker.js** - Now fetches companies from the API
- **Profile.js** - Now saves/retrieves profile from the API
- All data is synced with the backend database

### Backend Created
- **Express.js server** with REST API endpoints
- **SQLite database** for persistent data storage
- **3 route modules**: companies, profile, documents
- **CORS enabled** for secure frontend-backend communication

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | Get all companies |
| POST | `/api/companies` | Add new company |
| PUT | `/api/companies/:id` | Update company |
| DELETE | `/api/companies/:id` | Delete company |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Save user profile |
| GET | `/api/documents` | Get all documents |
| POST | `/api/documents` | Add document reference |
| DELETE | `/api/documents/:id` | Delete document |

## File Structure
```
placement-tracker/
├── server/                    # NEW: Express backend
│   ├── server.js             # Main server file
│   ├── db/database.js        # SQLite setup
│   └── routes/               # API routes
│       ├── companies.js
│       ├── profile.js
│       └── documents.js
├── src/                      # Frontend (updated for API)
│   ├── pages/
│   │   ├── CompanyTracker.js (UPDATED)
│   │   └── Profile.js        (UPDATED)
│   └── api/                 # NEW: API service
│       └── apiService.js    # Centralized API calls
├── .env.local               # NEW: Frontend env config
├── package.json             # UPDATED: Added dependencies
└── BACKEND_SETUP.md         # NEW: Detailed documentation
```

## Troubleshooting

**Q: Backend not connecting?**
- A: Make sure you're using `npm run dev` to run both servers
- Check that port 5000 is not in use

**Q: Seeing 404 errors?**
- A: Wait a few seconds for both servers to start
- Check browser console and Network tab for actual errors

**Q: Want to reset database?**
- A: Delete `server/db/tracker.db` file, it will be recreated on next run

## Next Steps

- The app now reads/writes from a database backend
- Frontend components have loading and error states
- Production ready once you build with `npm run build`
- Can be deployed to a server or Heroku

Enjoy your placement tracker with backend support! 🚀
