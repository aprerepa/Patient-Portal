# Patient Portal

A role-based healthcare portal UI built with React and React Router.

## Screenshots

![Home Page](HomePage.png)
![Login Page](LoginPage.png)
![Patient Dashboard](PatientDashboard.png)
![Patient Dashboard](PatientDashboard_1_.png)

## Built With
- React
- React Router
- Lucide React (icons)

## Features Implemented

### Role Selection
- Dual-role landing page (Patient / Physician)
- Role-specific color theming throughout (blue for patient, green for physician)
- Reusable `RoleSelect` component with dynamic props, bullet lists, and hover animations

### Login Page
- Role-specific icon, title, and color scheme driven by `useParams`
- Health ID input with format badge (PAT-#### / PHY-####)
- Password field with show/hide toggle using `useState`
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

### Patient Dashboard
- Sticky header with brand logo, user info, and logout button
- Tab-based navigation bar
- AI health summary banner
- Stats grid showing vitals and health metrics
- Safety alert component with badge and color-coded styling
- Health trend chart with metric selector
- AI insight note below chart
- Recent activity feed with icons and timestamps
- Risk assessment section with labeled progress bars

## Routing Structure
- `/` — Role selection
- `/login/:role` — Login
- `/forgotpassword/:role` — Forgot password
- `/newaccount/:role` — Account creation
- `/dashboard/:role` — Dashboard

## In Progress
- Physician dashboard
- Backend / authentication logic
- Patient data integration
