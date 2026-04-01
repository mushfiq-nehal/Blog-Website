# Deploy to Render + Supabase (Free!)

## 🚀 Complete Deployment Guide

This guide deploys your blog to **Render** (Node.js) with **Supabase** (Free PostgreSQL).

**Total Cost:** $0/month (both free tiers)

---

## Step 1: Create Supabase Account & Database

### 1.1 Sign Up
Go to https://supabase.com
- Click **Sign up**
- Use GitHub login (easiest)

### 1.2 Create New Project
- Click **New project** (or + button)
- **Project name:** blog-db
- **Database password:** Generate strong password (save it!)
- **Region:** Choose closest to you
- Click **Create new project** (takes 2-3 minutes)

### 1.3 Wait for Project to Initialize
- Supabase will create your PostgreSQL database
- You'll see dashboard when ready

---

## Step 2: Get Supabase Connection Details

### 2.1 Find Connection String
1. In Supabase dashboard, click **Project Settings** (bottom left)
2. Go to **Database** tab
3. Under **Connection string**, find **PostgreSQL**
4. Click **URI** tab
5. You'll see something like:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Copy the full connection string!**

### 2.2 Extract Connection Details

From your connection string, extract:
- `DB_HOST` = The hostname (after @, before :)
- `DB_PORT` = Usually 5432
- `DB_NAME` = postgres (or your custom DB name)
- `DB_USER` = postgres
- `DB_PASSWORD` = Your database password

**Example:**
```
Connection String:
postgresql://postgres:abc123@db.supabase.co:5432/postgres

Extract:
DB_HOST=db.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=abc123
```

---

## Step 3: Delete Render's PostgreSQL (Optional)

If you created Render PostgreSQL earlier:
1. Go to Render dashboard
2. Click the **blog-db** PostgreSQL service
3. Click **Delete service** (you won't need it)

Don't worry - your blog-app service stays!

---

## Step 4: Update Render Web Service

### 4.1 Go to Web Service Settings
1. Go to https://render.com dashboard
2. Click your **blog-app** (Web Service)
3. Go to **Environment** tab

### 4.2 Update Environment Variables

Delete/Replace all variables with:

```
NODE_ENV=production
PORT=3000
SESSION_SECRET=generate-random-strong-secret-here
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-password
```

**Replace with your actual Supabase details!**

### 4.3 Generate SESSION_SECRET

Run this in PowerShell:
```powershell
-join (1..32 | ForEach-Object { [char][int](Get-Random -Minimum 33 -Maximum 127) })
```

Or use online tool: https://generate-random.org/ (copy random string)

### 4.4 Save Variables
Click **Save** - Render auto-deploys!

---

## Step 5: Run Database Schema

Your app needs tables in Supabase. You have two options:

### Option A: Manual Setup (Recommended for First Time)

1. In Supabase, click **SQL Editor** (left menu)
2. Click **New query**
3. Copy-paste your schema from `database/schema.sql`
4. Click **Run**
5. Tables are created ✅

### Option B: From Your Local Docker

```powershell
# Get Supabase connection details
# Connect via psql and run schema

psql postgresql://postgres:PASSWORD@HOST:5432/postgres < database/schema.sql
```

---

## Step 6: Verify Deployment

### 6.1 Check Render Logs
1. Render dashboard → **blog-app**
2. Click **Logs** tab
3. Look for: `Server running on http://localhost:3000` ✅

### 6.2 Access Your Blog
1. Go to: https://your-render-url.onrender.com
2. You should see your blog! 🎉

### 6.3 Test Functionality
- Create a post
- Create an account
- Post a comment
- If all works → ✅ Fully deployed!

---

## 🔧 Troubleshooting

### Database Connection Error

**Error:** `failed to connect to database`

**Fix:**
1. Verify `DB_HOST` is correct (check Supabase)
2. Verify `DB_PASSWORD` is exact
3. Make sure schema was created (Step 5)
4. Check Render logs for exact error

### App Crashes After Deploy

**Error:** `Error: Cannot find module`

**Fix:**
1. Render logs will show the error
2. Make sure `npm ci` completed successfully
3. Check dependencies in package.json

### Schema Tables Not Found

**Error:** `relation "posts" does not exist`

**Fix:**
1. Go to Supabase SQL Editor
2. Run your `database/schema.sql` script
3. Verify all tables created

---

## 📊 Your Deployment Stack

```
GitHub Repo
    ↓
GitHub Actions (CI/CD) ← Builds Docker image
    ↓
Docker Hub ← Stores Docker image
    ↓
Render (Web Service) ← Runs Docker image
    ↓ (connects to)
Supabase PostgreSQL ← Stores data
```

---

## 💰 Costs

| Service | Tier | Cost |
|---------|------|------|
| Render Web | Starter | $7/month |
| Supabase PostgreSQL | Free | $0 |
| **Total** | | **$7/month** |

Supabase free tier gives you 500 MB storage (enough for thousands of blog posts).

---

## 🎯 Next Steps (After Deployment Works)

1. **Add custom domain** (in Render settings)
2. **Enable auto-deploy** (GitHub integration)
3. **Setup monitoring** (alerts if app crashes)
4. **Add backups** (Supabase backup settings)
5. **Optimize database** (add indexes if slow)

---

## 🚀 You're Done!

Your blog is now:
- ✅ Running on Render
- ✅ Using Supabase database
- ✅ Auto-deploys from GitHub
- ✅ Free (for now!)

Congratulations! 🎉
