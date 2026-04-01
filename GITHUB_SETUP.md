# GitHub Actions Setup - Docker Authentication Fix

## 🔧 Docker Hub Credentials Issue

The error `401 Unauthorized: access token has insufficient scopes` means your Docker credentials are invalid.

### Option 1: Use Docker Hub Access Token (Recommended)

1. **Create Docker Hub Access Token:**
   - Log in to https://hub.docker.com
   - Click your profile icon → **Account Settings → Security**
   - Click **New Access Token**
   - Give it a name (e.g., "GitHub Actions")
   - Select scope: **Read, Write, Delete**
   - Copy the token

2. **Add to GitHub Secrets:**
   - Go to your GitHub repo → **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - **Name:** `DOCKER_USERNAME` → **Value:** YOUR_DOCKER_USERNAME
   - **Name:** `DOCKER_PASSWORD` → **Value:** PASTE_YOUR_ACCESS_TOKEN_HERE (NOT your password!)

### Option 2: Create Docker Hub Personal Access Token (Alternative)

```bash
# From command line (if docker already set up):
docker login
# Then input your credentials
```

### Option 3: Skip Docker Push (For Testing)

If you don't have Docker Hub yet, just **don't set the secrets**. The pipeline will skip the docker push step and still run tests.

---

## ✅ Update Options

I've already updated the workflow to:
- ✅ Use latest GitHub Actions versions (v4 instead of v3)
- ✅ Fix security scan to install dependencies
- ✅ Build only runs on `main` branch

## 📋 What to Do Now

Choose one:

**[A] If you have Docker Hub account:**
1. Create access token (steps above)
2. Add to GitHub Secrets
3. Push a new commit to trigger pipeline

**[B] If you don't have Docker Hub:**
1. Don't worry about secrets
2. Pipeline will skip Docker push
3. Still runs tests and security scan

**[C] To test pipeline locally first:**
```bash
cd "Blog Website"
act -j test  # Requires 'act' tool installed
```

---

## 🔍 Verify Secrets Are Set

```bash
# In GitHub repo
Settings → Secrets and variables → Actions
# You should see both secrets listed:
# ✓ DOCKER_USERNAME
# ✓ DOCKER_PASSWORD
```

## 🚀 Commit Updated Workflow

```powershell
cd "c:\Users\mushf\OneDrive\Desktop\Blog Website"
git add .github/workflows/ci-cd.yml
git commit -m "fix: update github actions to latest versions and fix docker auth"
git push
```

The pipeline will trigger automatically!
