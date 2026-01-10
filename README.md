# Smart Parking System

A full-stack parking management system with separate interfaces for users, drivers, managers, and admins.

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

- User parking management
- Driver assignment system
- Manager dashboard
- Admin controls
- Real-time updates
- phone-responsive design

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL (supabase)
- **Authentication:** JWT
- **Deployment:** Vercel Render
