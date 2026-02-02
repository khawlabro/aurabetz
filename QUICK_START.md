# 🚀 Quick Start Guide - Deploy to Netlify in 15 Minutes

This is the fastest way to get your AuraBetz app live on Netlify.

## ⚡ Step 1: Firebase Setup (5 minutes)

### 1.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "aurabetz" → Disable Analytics → Create

### 1.2 Enable Google Auth
1. Click "Authentication" → "Get started"
2. Click "Sign-in method" tab → Enable "Google"
3. Add support email → Save

### 1.3 Create Database
1. Click "Firestore Database" → "Create database"
2. Select "Production mode" → Choose location → Enable

### 1.4 Set Security Rules
1. Click "Rules" tab → Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /picks/{pickId} {
      allow read: if true;
      allow write: if false;
    }
    match /pickFollowers/{followerId} {
      allow read: if request.auth != null;
      allow create, delete: if request.auth != null;
    }
  }
}
```

2. Click "Publish"

### 1.5 Get Config Values
1. Click ⚙️ → "Project settings"
2. Scroll to "Your apps" → Click Web icon `</>`
3. Register app → Copy these 6 values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

---

## 🌐 Step 2: Deploy to Netlify (5 minutes)

### Option A: GitHub Deploy (Recommended)

1. **Push to GitHub:**
   ```bash
   cd aurabetz-netlify
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/aurabetz.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select your repo
   - Build command: `pnpm install && pnpm run build`
   - Publish directory: `dist/public`
   - Add environment variables (see Step 3)
   - Click "Deploy site"

### Option B: Drag & Drop Deploy

1. **Build locally:**
   ```bash
   cd aurabetz-netlify
   pnpm install
   pnpm run build
   ```

2. **Deploy:**
   - Go to https://app.netlify.com/drop
   - Drag the `dist/public` folder
   - Wait for deployment

---

## 🔐 Step 3: Add Environment Variables (3 minutes)

1. In Netlify, go to "Site settings" → "Environment variables"
2. Click "Add a variable" for each:

```
VITE_FIREBASE_API_KEY = [paste from Firebase]
VITE_FIREBASE_AUTH_DOMAIN = [paste from Firebase]
VITE_FIREBASE_PROJECT_ID = [paste from Firebase]
VITE_FIREBASE_STORAGE_BUCKET = [paste from Firebase]
VITE_FIREBASE_MESSAGING_SENDER_ID = [paste from Firebase]
VITE_FIREBASE_APP_ID = [paste from Firebase]
```

3. Go to "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

---

## ✅ Step 4: Authorize Domain (2 minutes)

1. Copy your Netlify URL (e.g., `random-name-123.netlify.app`)
2. Go to Firebase Console → Authentication → Settings → Authorized domains
3. Click "Add domain" → Paste your Netlify domain (without https://)
4. Click "Add"

---

## 🎉 Step 5: Test Your App

1. Visit your Netlify URL
2. Click "Sign in with Google"
3. Verify login works

---

## 📊 Step 6: Add Sample Picks

1. Go to Firebase Console → Firestore Database
2. Click "Start collection" → Collection ID: `picks`
3. Add a document with these fields:
   - `sport` (string): NBA
   - `matchup` (string): Lakers vs Warriors
   - `pick` (string): Lakers ML
   - `odds` (string): -150
   - `confidence` (number): 75
   - `analysis` (string): Lakers have strong home advantage and are coming off a big win...
   - `createdAt` (timestamp): Click "Set to current time"
   - `updatedAt` (timestamp): Click "Set to current time"
4. Click "Save"
5. Refresh your app to see the pick!

---

## 🔧 Troubleshooting

**"This domain is not authorized"**
→ Add your Netlify domain to Firebase Authorized domains (Step 4)

**"Configuration not found"**
→ Check environment variables are set correctly (Step 3)

**No picks showing**
→ Add sample data in Firestore (Step 6)

**Build fails**
→ Make sure build command is: `pnpm install && pnpm run build`

---

## 🎯 Next Steps

- ✅ Connect custom domain (Netlify → Domain settings)
- ✅ Update payment info in MembershipUnlockModal.tsx
- ✅ Add more picks via Firestore
- ✅ Share your site!

---

## 📚 Need More Help?

See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.

---

**You're done! Your app is live! 🚀**
