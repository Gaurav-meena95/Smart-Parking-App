# Smart Parking System

A full-stack parking management system with separate interfaces for users, drivers, managers, and admins.

## Deployment Instructions

### Backend Deployment (Vercel)

1. Push your backend code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `DIRECT_URL`: Your PostgreSQL direct connection string
   - `sec_key`: Your JWT secret key

4. Deploy the backend and note the deployment URL

### Frontend Deployment (Vercel/Netlify)

1. Update the API URL in `Frontend/.env.production`:
   ```
   VITE_API_BASE_URL=https://smart-parking-app-72ps.onrender.com
   ```

2. Push frontend code to GitHub
3. Connect to Vercel/Netlify
4. Deploy the frontend

### Database Setup

1. Create a PostgreSQL database (recommended: Neon, Supabase, or Railway)
2. Run migrations:
   ```bash
   cd Backend
   npx prisma db push
   ```

3. Seed test data:
   ```bash
   node scripts/quickDriverData.js
   ```

## Test Credentials

After seeding data:

**Driver Login:**
- Email: driver@test.com
- Password: driver@123
- Role: driver

**Customer Login:**
- Email: customer@test.com
- Password: user123
- Role: user

## Features

- User parking management
- Driver assignment system
- Manager dashboard
- Admin controls
- Real-time updates
- Mobile-responsive design

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Prisma
- **Database:** PostgreSQL (supabase)
- **Authentication:** JWT
- **Deployment:** Vercel Render