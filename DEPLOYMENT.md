# Vercel Deployment Guide for MeetZap

## Overview
Deploy MeetZap Next.js app to Vercel with PostgreSQL database.

## Prerequisites
- GitHub account (to connect repo to Vercel)
- Vercel account (free tier works)
- PostgreSQL database (options below)

## Step 1: Set Up PostgreSQL Database

Choose one of these options:

### Option A: Neon via Vercel Marketplace (Recommended)
Neon is a serverless Postgres provider with a generous free tier, integrated directly into Vercel.

1. Go to your Vercel project → **Storage** tab
2. Under **Marketplace Database Providers**, find **Neon** and click **Create**
3. Follow the prompts to create a Neon database (e.g., `meetzap-db`)
4. After creation, you'll see the database dashboard with:
   - **Status**: Available
   - **Quickstart** tabs showing connection info (`.env.local`, `psql`, `Drizzle`, etc.)
5. Click **Connect Project** button to link the database to your Vercel project
6. Vercel will automatically add environment variables:
   - `DATABASE_URL` (pooled connection - recommended for most uses)
   - `DATABASE_URL_UNPOOLED` (direct connection)
   - `PGHOST`, `PGHOST_UNPOOLED`, etc.

**Free tier includes**: 0.5 GB storage, 1 project, unlimited databases

**Note**: The Neon guide shows installing `@neondatabase/serverless`, but MeetZap uses the standard `pg` driver with Drizzle ORM, which works perfectly with Neon. No additional driver installation needed.

### Option B: Supabase via Vercel Marketplace
1. Go to your Vercel project → **Storage** tab
2. Under **Marketplace Database Providers**, find **Supabase** and click **Create**
3. Follow the prompts to create a database
4. Vercel will automatically configure the environment variables

### Option C: Neon directly (if not using Vercel integration)
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb`)
4. Manually add it as `DATABASE_URL` in Vercel Environment Variables

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

**If you used Vercel Marketplace (Option A or B)**: After clicking **Connect Project**, environment variables are automatically added to your Vercel project. You can verify them in **Settings** → **Environment Variables**. Skip to Step 5.

**If you set up the database manually (Option C)**: Add the following in Vercel Dashboard → Your Project → **Settings** → **Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Production, Preview, Development |

**Note**: `NEXT_PUBLIC_APP_URL` is NOT needed - the app uses `window.location.origin` which automatically uses the correct domain.

## Step 5: Set Up Database Schema

After connecting the database, you need to push the database schema to create the tables.

### Option A: Via Vercel CLI (Recommended)
```bash
# First, link your local codebase to the Vercel project (only needed once)
vercel link
# Select your account, then choose "Link to existing project" and select your project

# Pull the environment variables from Vercel to your local machine
vercel env pull .env.development.local

# Push the Drizzle schema to create tables in Neon
npm run db:push
```

### Option B: Copy DATABASE_URL manually
1. Go to Vercel Dashboard → **Storage** → your database → **Quickstart** tab
2. Click **Show secret** and copy the `DATABASE_URL` value
3. Run locally:
```bash
export DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
npm run db:push
```

You should see output like:
```
[✓] Changes applied
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

### "Your codebase isn't linked to a project on Vercel"
If you see this error when running `vercel env pull`:
```bash
vercel link
```
Select your account and link to your existing Vercel project.

### Accessing Neon Console
You can manage your database directly from Vercel:
- Go to **Storage** → your database → click **Open in Neon**
- Use the **Neon SQL Editor** to run queries and inspect data

### Database connection errors
- Verify `DATABASE_URL` is set correctly in Vercel (check **Settings** → **Environment Variables**)
- For Neon: The default `DATABASE_URL` uses connection pooling, which is recommended
- Use `DATABASE_URL_UNPOOLED` if you have issues with pgbouncer
- Ensure the database is not paused (Neon free tier pauses after 5 days of inactivity)

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
