# Student Management System

A full-stack student management system with a React frontend and a Spring Boot backend. Students can create accounts, sign in, view their marks, update their profile, and delete their account. Administrators can sign in, manage student accounts, and add marks.

## Technology

- Frontend: React 19, Vite, and Oxlint
- Backend: Spring Boot 4, Spring Web MVC, Spring Data JPA, and Spring Security
- Database: MySQL
- Passwords: BCrypt hashing

## Project Structure

```text
student-management-system/
├── backend/       Spring Boot REST API
├── frontend/      React and Vite application
└── stu_management.sql
```

## Requirements

- Java 21 or newer
- Node.js and npm
- MySQL 
- IntelliJ IDEA, VS Code, or another Java/React IDE

## Database Setup

1. Create a database named `stu_management`.
2. Import `stu_management.sql` into that database.
3. Check the database username and password in `backend/src/main/resources/application.properties`.

The default configuration expects MySQL on `localhost:3306` with the `root` user and an empty password. Change it for your local database setup.

The SQL dump contains example records. Its placeholder passwords are not valid BCrypt passwords. Create a new student through the registration page, and replace the example admin password with a real BCrypt hash before using the example admin account.

## Run the Backend

From the repository root:

```powershell
cd backend
./mvnw.cmd spring-boot:run
```

The API starts at `http://localhost:8080`.

Run the backend tests with:

```powershell
cd backend
./mvnw.cmd test
```

## Run the Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Vite proxies `/api` requests to the backend at `http://localhost:8080`.

Frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

## Authentication

Login responses contain a bearer token, role, and user ID. The frontend stores these values in `localStorage` and sends the token on protected requests:

```http
Authorization: Bearer <token>
```

There are two roles:

- `STUDENT`: access to the student's own profile and marks
- `ADMIN`: access to all students and result management

## API Endpoints

Base URL: `http://localhost:8080/api`

### Authentication

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/auth/student/login` | Public |
| POST | `/auth/admin/login` | Public |

Login body:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Students

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/students` | Public registration |
| GET | `/students` | Admin only |
| GET | `/students/{id}` | Student owner or admin |
| PUT | `/students/{id}` | Student owner or admin |
| DELETE | `/students/{id}` | Student owner or admin |

Registration body:

```json
{
  "indexNumber": "100001W",
  "password": "student-password",
  "name": "Student Name",
  "email": "student@example.com"
}
```

### Results

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/results/student/{studentId}` | Admin only |
| GET | `/results/student/{studentId}` | That student or admin |
| GET | `/results` | Admin only |
| PUT | `/results/{id}` | Admin only |
| DELETE | `/results/{id}` | Admin only |

Result body:

```json
{
  "subject": "Information Technology",
  "marks": 85.5
}
```

## Testing Without Postman

The backend includes `backend/test.http`, which can be run using IntelliJ IDEA's built-in HTTP Client or the VS Code REST Client extension. Protected requests must include the bearer token returned by login.

PowerShell example:

```powershell
$body = @{ email = "student@example.com"; password = "student-password" } | ConvertTo-Json
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:8080/api/auth/student/login" `
  -ContentType "application/json" -Body $body
```

## Frontend Pages

```text
frontend/src/
├── App.jsx                         Page/session switcher
├── api.js                          Shared API and session helpers
├── components/
│   ├── DashboardLayout.jsx         Shared dashboard shell
│   └── StatusMessage.jsx           Shared success/error message
└── pages/
    ├── LoginPage.jsx               Student login, registration, admin login
    ├── AdminDashboard.jsx          Student management and marks entry
    └── StudentDashboard.jsx        Marks, profile, delete account
```

## Security Notes

- Passwords are hashed with BCrypt before they are stored.
- Password fields are excluded from API responses.
- Student access is limited to the authenticated student's own data.
- Result creation, editing, and deletion are restricted to administrators.
- The current token store is in memory, so active tokens are lost when the backend restarts.
