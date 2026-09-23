# Frontend

React and Vite client for the Student Management System.

## Start Development Server

From this directory:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

The Vite development server proxies `/api` requests to `http://localhost:8080`, so the Spring Boot backend must be running separately.

## Available Commands

```powershell
npm run dev       # Start the development server
npm run build     # Create a production build
npm run lint      # Run Oxlint
npm run preview   # Preview the production build
```

## Page Structure

- `src/pages/LoginPage.jsx`: student login, student registration, and admin login
- `src/pages/AdminDashboard.jsx`: student directory, account deletion, and marks entry
- `src/pages/StudentDashboard.jsx`: personal marks, profile editing, account deletion, and logout
- `src/components/DashboardLayout.jsx`: shared dashboard header and logout control
- `src/components/StatusMessage.jsx`: shared success and error message component
- `src/api.js`: authenticated requests and local session helpers

The selected role and bearer token are stored in `localStorage` after login. The frontend sends the token as an `Authorization: Bearer` header for protected API requests.
