# Patient Portal

A full-stack, role-based patient portal built with React, TypeScript, Node.js/Express, and PostgreSQL. Features secure authentication, protected REST APIs, and modular dashboard workflows for patient and physician users.

## Screenshots

![Home Page](screenshots/HomePage.png)
![Login Page](screenshots/LoginPage.png)
![Patient Dashboard](screenshots/PatientDashboard.png)
![Patient Dashboard](screenshots/PatientDashboard(1).png)

## Built With
Frontend: React, TypeScript, React Router, CSS, Lucide React
Backend: Node.js, Express, TypeScript, PostgreSQL, Argon2, JWT, CORS, cookie-parser
Tools: Postman, DBeaver

## Features Implemented

### Authentication & Security
- Argon2 password hashing for secure credential storage
- JWT-based authorization with protected route middleware
- Parameterized PostgreSQL queries to prevent SQL injection
- Role-based routing and access control (patient / physician)

### Backend API
- POST /auth/register — create a new patient or physician account
- POST /auth/login — authenticate and receive a JWT
- GET /patient/profile — retrieve patient profile data (protected)
- GET /patient/vitals — retrieve patient vitals (protected)
- GET /patient/records — retrieve medical records (protected)
- GET /patient/medications — retrieve medications (protected)
- GET /patient/appointments — retrieve appointments (protected)

### Role Selection
- Dual-role landing page (Patient / Physician)
- Role-specific color theming throughout (blue for patient, green for physician)
- Reusable RoleSelect component with dynamic props, bullet lists, and hover animations

### Login Page
- Role-specific icon, title, and color scheme driven by useParams
- Health ID input with format badge (PAT-#### / PHY-####)
- Password field with show/hide toggle using useState
- Remember me checkbox
- Forgot password and Create Account navigation
- Back to role selection button

### Forgot Password Page
- Health ID or email input
- Form submission with success state — UI switches to confirmation message without a page reload
- Back to sign in navigation

### Account Creation Page
- Multi-section form: Personal Information, Security, and a Physician-only Professional Information section that conditionally renders based on role
- Auto-generated Health ID displayed in a banner (e.g. PAT-9848)
- Password and confirm password fields with independent show/hide toggles
- Terms of Service checkbox with required validation
- Already have an account? Sign in link
- Integrated with /auth/register backend endpoint

### Patient Dashboard
- Sticky header with brand logo, user info, and logout button
- Tab-based navigation bar with modules for Appointments, Medications, Medical Records, Vitals, Genomics, and Profile
- AI health summary banner
- Stats grid showing vitals and health metrics
- Safety alert component with badge and color-coded styling
- Health trend chart with metric selector
- AI insight note below chart
- Recent activity feed with icons and timestamps
- Risk assessment section with labeled progress bars

### In Progress
- Physician dashboard workflows
- Write/update routes for patient and physician interactions
- End-to-end live data connection for all dashboard modules
- Improved validation and error handling across API layers
