# AuraBetz - AI Sports Betting Picks

A modern, AI-powered sports betting picks platform built with React, Firebase, and deployed on Netlify.

## 🚀 Features

- **Google Authentication** - Secure sign-in with Firebase Auth
- **Real-time Picks** - AI-analyzed sports betting picks
- **Follow System** - Track and follow picks you're interested in
- **Responsive Design** - Beautiful UI that works on all devices
- **Dark Mode** - Eye-friendly dark theme
- **Premium Membership** - Unlock premium picks with payment integration

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4, shadcn/ui
- **Authentication:** Firebase Authentication (Google OAuth)
- **Database:** Cloud Firestore
- **Hosting:** Netlify
- **Routing:** Wouter

## 📦 Project Structure

```
aurabetz-netlify/
├── client/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and Firebase config
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   └── index.css     # Global styles
│   └── index.html
├── netlify.toml          # Netlify configuration
├── DEPLOYMENT.md         # Detailed deployment guide
└── package.json
```

## 🚀 Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd aurabetz-netlify
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Add your Firebase configuration to `.env`:**
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server:**
   ```bash
   pnpm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🌐 Deployment to Netlify

See the comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide for step-by-step instructions on:
- Setting up Firebase (Authentication + Firestore)
- Deploying to Netlify
- Configuring environment variables
- Adding sample data
- Connecting a custom domain

### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

**Note:** You'll need to configure Firebase environment variables after deployment.

## 🔧 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally
- `pnpm run check` - Run TypeScript type checking
- `pnpm run format` - Format code with Prettier

## 🔐 Firebase Setup

### Authentication
- Google OAuth is enabled by default
- Users are automatically created in Firestore on first sign-in

### Firestore Collections

**users**
```typescript
{
  id: string;           // Firebase Auth UID
  email: string;
  name: string;
  photoURL: string;
  createdAt: timestamp;
  lastSignedIn: timestamp;
}
```

**picks**
```typescript
{
  id: string;
  sport: string;        // e.g., "NBA", "NFL"
  matchup: string;      // e.g., "Lakers vs Warriors"
  pick: string;         // e.g., "Lakers ML"
  odds: string;         // e.g., "-150"
  confidence: number;   // 0-100
  analysis: string;     // AI analysis text
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

**pickFollowers**
```typescript
{
  id: string;           // Format: userId_pickId
  pickId: string;
  userId: string;
  followedAt: timestamp;
}
```

## 🎨 Customization

### Branding
- Update logo and colors in `client/src/index.css`
- Modify the theme in `client/src/App.tsx`

### Payment Integration
- Update payment methods in `client/src/components/MembershipUnlockModal.tsx`
- Add your CashApp, Venmo, or crypto payment details

## 📝 Adding Picks

### Option 1: Firebase Console (Manual)
1. Go to Firebase Console → Firestore Database
2. Navigate to `picks` collection
3. Add document with required fields

### Option 2: Admin Interface (Recommended)
Create an admin page that uses the `addPick` function from `client/src/lib/firestore.ts`:

```typescript
import { addPick } from '@/lib/firestore';

await addPick({
  sport: 'NBA',
  matchup: 'Lakers vs Warriors',
  pick: 'Lakers ML',
  odds: '-150',
  confidence: 75,
  analysis: 'Lakers have strong home court advantage...',
});
```

## 🔒 Security

- All Firebase configuration is stored in environment variables
- Firestore security rules restrict write access to admin users
- Authentication is required for following picks
- HTTPS enforced on Netlify

## 📊 Monitoring

- **Firebase Console:** Monitor authentication and database usage
- **Netlify Dashboard:** Track site traffic and build logs
- **Browser DevTools:** Debug client-side issues

## 🐛 Troubleshooting

### "This domain is not authorized"
Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Environment variables not working
Make sure all variables start with `VITE_` prefix

### Build fails on Netlify
Check that build command is: `pnpm install && pnpm run build`

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup instructions
- Open an issue on GitHub
- Contact support at your-email@example.com

---

**Built with ❤️ for sports betting enthusiasts**
