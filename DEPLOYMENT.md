# Vercel Deployment Guide for MeetZap

## Overview
Deploy MeetZap Next.js app to Vercel with PostgreSQL database.

## Prerequisites
- GitHub account (to connect repo to Vercel)
- Vercel account (free tier works)
- PostgreSQL database (options below)

## Step 1: Set Up PostgreSQL Database

Choose one of these options:

### Option A: Vercel Postgres (Recommended - easiest)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Create a new project or go to your project
3. Go to **Storage** tab → **Create Database** → **Postgres**
4. Follow prompts to create database
5. Vercel will automatically add `DATABASE_URL` to your project

### Option B: Neon (Free tier, generous limits)
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb`)

### Option C: Supabase (Free tier)
1. Go to [supabase.com](https://supabase.com) and create project
2. Go to **Settings** → **Database** → **Connection string**
3. Copy the URI connection string

## Step 2: Push Code to GitHub

If not already done:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 3: Deploy to Vercel

### Via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Install Command**: `npm install` (default)

### Via Vercel CLI (Alternative)
```bash
npm i -g vercel
vercel login
vercel
```

## Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |

**Note**: `NEXT_PUBLIC_APP_URL` is NOT needed - the app uses `window.location.origin` which automatically uses the correct domain.

## Step 5: Set Up Database Schema

After first deployment, you need to push the database schema.

### Option A: Via Vercel CLI
```bash
vercel env pull .env.local
npm run db:push
```

### Option B: Locally with production DATABASE_URL
```bash
export DATABASE_URL="your-production-database-url"
npm run db:push
```

## Step 6: Redeploy (if needed)

After setting up the database schema:
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click the three dots on latest deployment → **Redeploy**

## Verification

After deployment:
1. Visit your Vercel URL (e.g., `https://meetzap.vercel.app`)
2. Create a new event
3. Share the link - it should show the production URL (not localhost)
4. Test adding availability

## Share Link

The share link automatically uses the correct domain because we use:
```tsx
const [shareUrl, setShareUrl] = useState(`/event/${event.id}/respond`);

useEffect(() => {
  setShareUrl(`${window.location.origin}/event/${event.id}/respond`);
}, [event.id]);
```

This means:
- On localhost: `http://localhost:3000/event/xxx/respond`
- On Vercel: `https://your-app.vercel.app/event/xxx/respond`

## Troubleshooting

### Database connection errors
- Verify `DATABASE_URL` is set correctly in Vercel
- Check if database allows connections from Vercel IPs
- For Neon: Enable "Pooler" connection mode

### Build failures
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`

### 500 errors on API routes
- Check Function logs in Vercel Dashboard
- Verify database schema is pushed (`npm run db:push`)

## Custom Domain (Optional)

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
