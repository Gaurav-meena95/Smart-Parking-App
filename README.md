# Smart Parking System

A full-stack parking management system with separate interfaces for users, drivers, managers, and admins.

## Authentication Flow

### Login Process
1. User enters credentials (email, password, role) on the login page
2. Frontend sends login request to backend API
3. Backend validates credentials and returns JWT tokens
4. Frontend stores tokens in localStorage:
   - `token`: Main authentication token
   - `refreshToken`: Token for refreshing expired sessions
5. User is redirected to their role-specific dashboard

### Dashboard Access
- **Admin Dashboard**: System overview, driver approvals, analytics
- **Manager Dashboard**: Valet assignments, driver management, operations
- **Driver Console**: Assignment management, task execution
- **User Dashboard**: Parking management, vehicle registration

### Logout Functionality
- Logout button available on all dashboards (top-right corner)
- Clicking logout button:
  1. Clears authentication tokens from localStorage
  2. Resets authentication state in React context
  3. Redirects user to login page
- Automatic logout on token expiration or API errors

### LocalStorage Management
- **On Login**: Saves `token` and `refreshToken` to localStorage
- **On Logout**: Removes both tokens from localStorage
- **On Error**: Clears tokens and resets authentication state
- **Token Refresh**: Automatically updates tokens in localStorage when refreshed

## Deployment Instructions

### Backend Deployment (Vercel)

1. Push your backend code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `DIRECT_URL`: Your PostgreSQL direct connection string
   - `sec_key`: Your JWT secret key
   - `PORT`: Your Port

4. Deploy the backend and note the deployment URL

### Frontend Deployment (Vercel/Netlify)

1. Update the API URL in `Frontend/.env.production`:
   ```
   VITE_API_BASE_URL=https://smart-parking-app-72ps.onrender.com/api
   ```

2. Push frontend code to GitHub
3. Connect to Vercel/Netlify
4. Deploy the frontend

### Database Setup

1. Create a PostgreSQL database (Supabase)
2. Run migrations:
   ```bash
   cd Backend
   npx prisma migrate dev
   ```

## Test Credentials

**User Login:**

      email: 'user@demo.com',
      password: 'User@123',
      role: 'user'
   **Manager Login:**
   
      email: 'manager@demo.com',
      password: 'Manager@123',
      role: 'manager'
      
   **Driver Login:**
   
      email: 'driver@demo.com',
      password: 'Driver@123',
      role: 'driver'

   **Admin Login:**
   
      email: 'admin@demo.com',
      password: 'Admin@123',
      role: 'admin'


## Features

- **User Management**: Complete parking lifecycle management
- **Driver Assignment System**: Automated valet task distribution
- **Manager Dashboard**: Operations oversight and driver management
- **Admin Controls**: System administration and approvals
- **Authentication & Security**: JWT-based authentication with localStorage persistence
- **Logout Functionality**: Secure session termination across all dashboards
- **Real-time Updates**: Live status updates and notifications
- **Mobile-Responsive Design**: Optimized for all device sizes

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL (supabase)
- **Authentication:** JWT
- **Deployment:** Vercel Render
