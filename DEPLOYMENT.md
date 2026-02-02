# AuraBetz - Netlify Deployment Guide

This guide will walk you through deploying your AuraBetz sports betting AI picks web app to Netlify with Firebase Authentication and Firestore database.

## Prerequisites

1. **Firebase Account** - Sign up at [Firebase Console](https://console.firebase.google.com/)
2. **Netlify Account** - Sign up at [Netlify](https://www.netlify.com/)
3. **GitHub Account** (optional but recommended) - For continuous deployment

---

## Part 1: Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "aurabetz-prod")
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Google Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **"Get started"**
3. Click on the **"Sign-in method"** tab
4. Click on **"Google"** provider
5. Toggle **"Enable"**
6. Enter a project support email
7. Click **"Save"**

### Step 3: Create Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location (select the one closest to your users)
5. Click **"Enable"**

### Step 4: Configure Firestore Security Rules

1. In Firestore Database, click on the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Picks collection - anyone can read, only admins can write
    match /picks/{pickId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Pick followers - users can read all, write their own
    match /pickFollowers/{followerId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      followerId.matches('^' + request.auth.uid + '_.*');
      allow delete: if request.auth != null && 
                      followerId.matches('^' + request.auth.uid + '_.*');
    }
  }
}
```

3. Click **"Publish"**

### Step 5: Get Firebase Configuration

1. In your Firebase project, click the **gear icon** (⚙️) next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`)
5. Register your app with a nickname (e.g., "AuraBetz Web")
6. **DO NOT** check "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the configuration values - you'll need these for Netlify:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Step 6: Add Authorized Domain

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Click **"Add domain"**
3. Add your Netlify domain (you'll get this after deploying, e.g., `your-app-name.netlify.app`)
4. Also add your custom domain if you have one

---

## Part 2: Netlify Deployment

### Option A: Deploy via Netlify UI (Drag & Drop)

1. **Build the project locally:**
   ```bash
   cd /path/to/aurabetz-netlify
   pnpm install
   pnpm run build
   ```

2. **Go to [Netlify](https://app.netlify.com/)**

3. **Drag and drop** the `dist/public` folder to the Netlify drop zone

4. **Configure environment variables:**
   - Go to **Site settings** → **Environment variables**
   - Click **"Add a variable"**
   - Add the following variables with your Firebase config values:
     - `VITE_FIREBASE_API_KEY` = your Firebase API key
     - `VITE_FIREBASE_AUTH_DOMAIN` = your Firebase auth domain
     - `VITE_FIREBASE_PROJECT_ID` = your Firebase project ID
     - `VITE_FIREBASE_STORAGE_BUCKET` = your Firebase storage bucket
     - `VITE_FIREBASE_MESSAGING_SENDER_ID` = your Firebase messaging sender ID
     - `VITE_FIREBASE_APP_ID` = your Firebase app ID

5. **Redeploy** with environment variables:
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Option B: Deploy via GitHub (Recommended)

1. **Create a GitHub repository:**
   ```bash
   cd /path/to/aurabetz-netlify
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aurabetz.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"GitHub"** and authorize Netlify
   - Select your repository
   - Configure build settings:
     - **Build command:** `pnpm install && pnpm run build`
     - **Publish directory:** `dist/public`
   - Click **"Show advanced"** → **"New variable"**
   - Add all Firebase environment variables (see Option A, step 4)
   - Click **"Deploy site"**

---

## Part 3: Post-Deployment Configuration

### Step 1: Update Firebase Authorized Domains

1. Copy your Netlify URL (e.g., `https://your-app-name.netlify.app`)
2. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
3. Add your Netlify domain (without `https://`)

### Step 2: Connect Custom Domain (Optional)

1. In Netlify, go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow Netlify's DNS configuration instructions

### Step 3: Add Sample Picks Data

Since you're using Firestore, you'll need to add picks manually or create an admin interface. Here's a quick script to add sample data:

1. Go to Firebase Console → **Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `picks`
4. Add documents with these fields:
   - `sport` (string): "NBA"
   - `matchup` (string): "Lakers vs Warriors"
   - `pick` (string): "Lakers ML"
   - `odds` (string): "-150"
   - `confidence` (number): 75
   - `analysis` (string): "Lakers have strong home court advantage..."
   - `createdAt` (timestamp): Auto-generate
   - `updatedAt` (timestamp): Auto-generate

---

## Part 4: Testing

1. **Visit your Netlify URL**
2. **Click "Sign in with Google"**
3. **Verify authentication works**
4. **Check that picks display correctly**
5. **Test following/unfollowing picks**

---

## Troubleshooting

### Authentication Issues

**Error: "This domain is not authorized"**
- Solution: Add your Netlify domain to Firebase Authorized domains

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Solution: Check that all environment variables are set correctly in Netlify

### Build Issues

**Error: "Module not found"**
- Solution: Make sure `pnpm install` runs before `pnpm run build`

**Error: "Environment variable not defined"**
- Solution: Environment variables must start with `VITE_` to be accessible in the client

### Firestore Issues

**Error: "Missing or insufficient permissions"**
- Solution: Check your Firestore security rules are published correctly

---

## Environment Variables Reference

All environment variables needed for deployment:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Maintenance

### Adding New Picks

You can add picks in two ways:

1. **Firebase Console** (Manual):
   - Go to Firestore Database
   - Navigate to `picks` collection
   - Click "Add document"
   - Fill in the fields

2. **Admin Script** (Recommended):
   - Create an admin page in your app
   - Use the `addPick` function from `lib/firestore.ts`

### Monitoring

- **Firebase Console** → **Authentication**: Monitor user signups
- **Firebase Console** → **Firestore**: View database usage
- **Netlify Dashboard**: Monitor site traffic and build logs

---

## Cost Estimate (Free Tier)

- **Netlify Free Tier:**
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Unlimited sites

- **Firebase Free Tier (Spark Plan):**
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1 GB storage
  - 10 GB/month transfer

**Both services are free for small to medium traffic sites.**

---

## Support

For issues or questions:
- Firebase: [Firebase Support](https://firebase.google.com/support)
- Netlify: [Netlify Support](https://www.netlify.com/support/)

---

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Configure Firebase
3. ✅ Add sample picks data
4. 🔄 Set up custom domain
5. 🔄 Create admin interface for managing picks
6. 🔄 Set up email notifications
7. 🔄 Add analytics tracking

---

**Congratulations! Your AuraBetz app is now live on Netlify! 🎉**
