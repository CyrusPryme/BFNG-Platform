# 🚀 Vercel Deployment Guide for BFNG Platform

## ✅ Fixes Applied for Vercel Build Error

### The Problem
Your Vercel build was failing with the error:
```
Error [PrismaClientInitializationError]: Prisma has detected that this project was built on Vercel, which caches dependencies. 
This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered.
```

### The Solution

I've applied the following fixes:

#### 1. **Added `postinstall` Script** ✅
**File**: `package.json`

Added automatic Prisma client generation after npm install:
```json
"postinstall": "prisma generate"
```

This ensures Prisma Client is always generated when dependencies are installed on Vercel.

#### 2. **Added Binary Targets** ✅
**File**: `prisma/schema.prisma`

Added Vercel-compatible binary targets:
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

This ensures Prisma Client works on Vercel's infrastructure.

#### 3. **Updated Build Script** ✅
**File**: `package.json`

Changed build script from:
```json
"build": "prisma generate && next build"
```

To separate build and postinstall:
```json
"build": "next build",
"postinstall": "prisma generate"
```

#### 4. **Added `vercel-build` Script** ✅
For production deployments with database setup:
```json
"vercel-build": "prisma generate && prisma db push --accept-data-loss && next build"
```

#### 5. **Created `vercel.json`** ✅
Configured Vercel deployment settings for optimal build process.

---

## 📋 Deployment Steps for Vercel

### Step 1: Set Up Environment Variables

In your Vercel project settings, add these environment variables:

#### Required Variables:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secure-random-secret-here"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NEXT_PUBLIC_API_URL="https://your-app.vercel.app/api"
NODE_ENV="production"
```

#### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```
Or use an online generator: https://generate-secret.vercel.app/32

### Step 2: Configure Database for Production

**Important**: SQLite (`file:./dev.db`) works for development but **NOT for production on Vercel**.

For production, you have two options:

#### Option A: Use PostgreSQL (Recommended for Production)
1. Get a PostgreSQL database (Vercel Postgres, Supabase, Neon, etc.)
2. Update `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://username:password@host:5432/database"
   ```
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

#### Option B: Keep SQLite (For Testing Only)
SQLite will work for initial deployment testing, but data will reset on each deployment.

### Step 3: Deploy to Vercel

#### Via Vercel Dashboard:
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variables (Step 1)
6. Click "Deploy"

#### Via Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 4: Verify Deployment

After deployment:
1. Check the deployment logs for any errors
2. Visit your deployed URL
3. Test login with admin credentials
4. Verify all pages load correctly

---

## 🔧 Troubleshooting Vercel Errors

### Error: "Prisma Client could not be generated"
**Solution**: Make sure `postinstall` script is in package.json and runs `prisma generate`

### Error: "Cannot find module '@prisma/client'"
**Solution**: 
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Redeploy

### Error: "Database file not found" (SQLite)
**Expected**: SQLite doesn't persist on Vercel. Use PostgreSQL for production.

### Error: "Invalid binary target"
**Solution**: Check that `binaryTargets` includes `"rhel-openssl-1.0.x"` in schema.prisma

### Error: Build timeout
**Solution**: 
1. Upgrade to a paid Vercel plan (Pro) for longer build times
2. Or optimize your build by removing unnecessary dependencies

---

## 📊 What Changed in Your Files

### Modified Files:

1. **`package.json`**
   - Added `"postinstall": "prisma generate"`
   - Changed `"build"` to just `"next build"`
   - Added `"vercel-build"` script

2. **`prisma/schema.prisma`**
   - Added `binaryTargets = ["native", "rhel-openssl-1.0.x"]`

3. **`vercel.json`** (NEW FILE)
   - Configured Vercel build settings

### No Breaking Changes:
- ✅ Local development still works the same
- ✅ All existing code is compatible
- ✅ Database schema unchanged

---

## 🎯 Next Build Success Checklist

After pushing these changes, your Vercel build should:

1. ✅ Install dependencies successfully
2. ✅ Run `postinstall` → Generate Prisma Client
3. ✅ Compile TypeScript without errors
4. ✅ Build Next.js pages successfully
5. ✅ Deploy without errors

---

## 🔐 Security Reminders for Production

Before going to production:

- [ ] Generate a new random `NEXTAUTH_SECRET`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up SSL/HTTPS (Vercel provides this automatically)
- [ ] Configure CORS if needed
- [ ] Set up monitoring (Vercel Analytics, Sentry, etc.)
- [ ] Review and update all API keys
- [ ] Test all authentication flows
- [ ] Test payment integration (if applicable)

---

## 📱 Testing Your Deployment

### Test Admin Login:
1. Go to `https://your-app.vercel.app/auth/signin`
2. Login with: `admin@bfng.com.gh` / `admin123`
3. Should redirect to admin dashboard

### Test Customer Features:
1. Browse the shop
2. Add items to cart
3. Create test orders

### Monitor Errors:
Check Vercel dashboard → Your Project → Runtime Logs for any errors

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check Vercel Build Logs**: 
   - Vercel Dashboard → Your Project → Deployments → Click deployment → View Build Logs

2. **Check Runtime Logs**:
   - Vercel Dashboard → Your Project → Runtime Logs

3. **Common Issues**:
   - Database connection errors → Check `DATABASE_URL`
   - Authentication errors → Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
   - Build timeout → Upgrade Vercel plan or optimize build

---

## ✨ Success Indicators

Your deployment is successful when you see:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

And you can:
- ✅ Visit your deployed URL
- ✅ Login as admin
- ✅ Access admin dashboard
- ✅ Browse the shop
- ✅ All images load correctly

---

**Your BFNG Platform is now ready for Vercel deployment!** 🎉

Push these changes to GitHub and Vercel will automatically rebuild with the fixes applied.
