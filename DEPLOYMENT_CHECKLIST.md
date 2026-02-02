# 📋 Deployment Checklist

Use this checklist to ensure you complete all steps for a successful deployment.

## 🔥 Firebase Setup

### Create Project
- [ ] Go to Firebase Console (https://console.firebase.google.com/)
- [ ] Create new project named "aurabetz"
- [ ] Disable Google Analytics (optional)

### Enable Authentication
- [ ] Go to Authentication → Get started
- [ ] Enable Google sign-in provider
- [ ] Add support email address
- [ ] Save changes

### Setup Firestore Database
- [ ] Go to Firestore Database → Create database
- [ ] Select "Production mode"
- [ ] Choose database location
- [ ] Wait for database to be created

### Configure Security Rules
- [ ] Go to Firestore → Rules tab
- [ ] Copy rules from `firestore.rules` file
- [ ] Paste into Firebase console
- [ ] Click "Publish"

### Get Configuration Values
- [ ] Go to Project Settings (⚙️ icon)
- [ ] Scroll to "Your apps" section
- [ ] Click Web icon (`</>`)
- [ ] Register app with nickname "AuraBetz Web"
- [ ] Copy all 6 configuration values:
  - [ ] apiKey
  - [ ] authDomain
  - [ ] projectId
  - [ ] storageBucket
  - [ ] messagingSenderId
  - [ ] appId

---

## 🌐 Netlify Deployment

### Prepare Code
- [ ] Code is in a Git repository (GitHub recommended)
- [ ] All changes are committed
- [ ] Repository is pushed to GitHub

### Deploy to Netlify
- [ ] Go to Netlify (https://app.netlify.com/)
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect to GitHub
- [ ] Select your repository
- [ ] Configure build settings:
  - [ ] Build command: `pnpm install && pnpm run build`
  - [ ] Publish directory: `dist/public`

### Add Environment Variables
Add these 6 variables in Netlify → Site settings → Environment variables:
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_STORAGE_BUCKET
- [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] VITE_FIREBASE_APP_ID

### Trigger Deployment
- [ ] Go to Deploys tab
- [ ] Click "Trigger deploy" → "Clear cache and deploy site"
- [ ] Wait for build to complete
- [ ] Copy your Netlify URL (e.g., `random-name.netlify.app`)

---

## 🔐 Post-Deployment Configuration

### Authorize Domain in Firebase
- [ ] Go to Firebase Console → Authentication → Settings
- [ ] Click "Authorized domains" tab
- [ ] Click "Add domain"
- [ ] Paste your Netlify domain (without https://)
- [ ] Click "Add"

### Test Authentication
- [ ] Visit your Netlify URL
- [ ] Click "Sign in with Google"
- [ ] Verify login works successfully
- [ ] Check that you're redirected to dashboard

---

## 📊 Add Sample Data

### Add Test Picks
- [ ] Go to Firebase Console → Firestore Database
- [ ] Click "Start collection" → Collection ID: `picks`
- [ ] Add first pick document with fields:
  - [ ] sport (string): "NBA"
  - [ ] matchup (string): "Lakers vs Warriors"
  - [ ] pick (string): "Lakers ML"
  - [ ] odds (string): "-150"
  - [ ] confidence (number): 75
  - [ ] analysis (string): "Your AI analysis here..."
  - [ ] createdAt (timestamp): Current time
  - [ ] updatedAt (timestamp): Current time
- [ ] Add 2-3 more picks for variety

### Verify Data Display
- [ ] Refresh your app
- [ ] Verify picks show on dashboard
- [ ] Test following/unfollowing picks
- [ ] Check follower counts update

---

## 🎨 Customization (Optional)

### Update Branding
- [ ] Update payment info in `MembershipUnlockModal.tsx`
- [ ] Replace CashApp tag with yours
- [ ] Replace Venmo tag with yours
- [ ] Update pricing if needed

### Connect Custom Domain
- [ ] Go to Netlify → Domain settings
- [ ] Click "Add custom domain"
- [ ] Enter your domain name
- [ ] Follow DNS configuration instructions
- [ ] Wait for DNS propagation (up to 24 hours)
- [ ] Add custom domain to Firebase Authorized domains

---

## ✅ Final Testing

### Functionality Tests
- [ ] Landing page loads correctly
- [ ] Google sign-in works
- [ ] Dashboard displays picks
- [ ] Can follow/unfollow picks
- [ ] Follower count updates
- [ ] Profile page shows user info
- [ ] Logout works correctly
- [ ] Membership modal opens
- [ ] Facebook link works

### Cross-Browser Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile device

### Performance Check
- [ ] Page loads in under 3 seconds
- [ ] No console errors
- [ ] Images load properly
- [ ] Animations work smoothly

---

## 📈 Monitoring Setup

### Firebase Monitoring
- [ ] Check Authentication → Users tab
- [ ] Monitor Firestore → Usage tab
- [ ] Set up budget alerts (optional)

### Netlify Monitoring
- [ ] Check Analytics in Netlify dashboard
- [ ] Review build logs for warnings
- [ ] Monitor bandwidth usage

---

## 🎉 Launch!

- [ ] Share your app URL with users
- [ ] Post on social media
- [ ] Add to your portfolio
- [ ] Monitor for issues in first 24 hours

---

## 📝 Notes

**Your Netlify URL:** ___________________________________

**Your Custom Domain:** ___________________________________

**Firebase Project ID:** ___________________________________

**Deployment Date:** ___________________________________

---

## 🆘 Troubleshooting Reference

**Issue:** "This domain is not authorized"
**Fix:** Add domain to Firebase Authorized domains

**Issue:** "Configuration not found"
**Fix:** Check all 6 environment variables are set in Netlify

**Issue:** No picks showing
**Fix:** Add picks data in Firestore Database

**Issue:** Build fails
**Fix:** Verify build command and publish directory are correct

**Issue:** 404 on page refresh
**Fix:** Check `_redirects` file exists in `client/public/`

---

**Need help?** See DEPLOYMENT.md for detailed instructions or QUICK_START.md for a faster guide.
