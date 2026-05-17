# Firebase Setup Guide for Finance Tracker

Your Finance Tracker has been fully integrated with Firebase! Follow these steps to complete the setup:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `Finance Tracker` (or your preferred name)
4. Accept the terms and click "Create project"
5. Wait for the project to be created

## Step 2: Set Up Firebase Authentication

1. In the Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get started**
3. Enable **Email/Password** provider:
   - Click on **Email/Password** 
   - Toggle the "Enabled" switch
   - Click "Save"
4. Optionally enable **Google** and **GitHub** for OAuth login:
   - Click on **Google** 
   - Toggle "Enabled"
   - Add your support email
   - Click "Save"

## Step 3: Create Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in production mode**
4. Select a location (closest to your users)
5. Click **Create**

## Step 4: Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    match /transactions/{doc=**} {
      allow read, write: if request.auth.uid == resource.data.userId
        || request.auth.uid == request.resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    
    match /budgets/{doc=**} {
      allow read, write: if request.auth.uid == resource.data.userId
        || request.auth.uid == request.resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    
    match /goals/{doc=**} {
      allow read, write: if request.auth.uid == resource.data.userId
        || request.auth.uid == request.resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Your Firebase Config

1. In the Firebase Console, click the **Project Settings** (gear icon)
2. Go to the **General** tab
3. Scroll down to find your Firebase SDK snippet
4. Copy the entire config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## Step 6: Update Firebase Config File

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

3. Save the file

## Step 7: Test the Application

1. Open terminal in the project directory
2. Run: `npm run dev`
3. Navigate to `http://localhost:5173`
4. Create a new account using the "Create Account" tab
5. Add some transactions, budgets, and goals
6. Log out and log back in to verify data persists

## Architecture Overview

### Services Created:
- **`src/config/firebase.js`** - Firebase initialization
- **`src/services/authService.js`** - Authentication (sign up, sign in, logout)
- **`src/services/transactionService.js`** - Transaction CRUD + real-time listeners
- **`src/services/budgetService.js`** - Budget CRUD + real-time listeners
- **`src/services/goalService.js`** - Goal CRUD + real-time listeners

### Context Updated:
- **`src/context/FinanceContext.jsx`** - Now uses Firebase services instead of mock data
- Real-time listeners set up automatically when user logs in
- All data syncs across tabs/devices in real-time

### Authentication:
- Protected routes in `App.jsx`
- Login/Sign up in `Login.jsx`
- Logout button in `Sidebar.jsx`

### Database Collections:
- **users/** - User profiles
- **transactions/** - User transactions with `userId` field
- **budgets/** - User budgets with `userId` field
- **goals/** - User goals with `userId` field

## Real-Time Features

Your app now has:
✅ **Real-time syncing** - Changes appear instantly across all devices
✅ **Automatic loading states** - Shows spinners while data loads
✅ **Error handling** - Proper error messages and recovery
✅ **Data persistence** - All data saved to Firestore
✅ **User authentication** - Secure login/registration
✅ **Protected routes** - Only logged-in users can access the app

## Troubleshooting

### "Firebase config is missing"
- Make sure you've updated `src/config/firebase.js` with your actual config values

### "Authentication error"
- Check that you've enabled Email/Password in Firebase Authentication
- Verify Firestore rules are published

### "Data not saving"
- Check browser console for errors
- Verify Firestore rules allow the operation
- Check that user is logged in (check `user` in console)

### "Loading never completes"
- Check Firebase connection (console for errors)
- Verify internet connection
- Try refreshing the page

## Next Steps

You can now:
1. Deploy to Firebase Hosting: `npm install -g firebase-tools` → `firebase deploy`
2. Enable other authentication methods (Google, GitHub, etc.)
3. Add Cloud Functions for server-side logic
4. Set up backup and recovery
5. Enable offline persistence for offline mode

## Important Notes

- **Never commit your Firebase config to version control** - Use environment variables in production
- **Firestore read/write limits** - Monitor usage in Firebase Console to avoid unexpected charges
- **Security Rules are critical** - Review the rules to ensure only authorized users can access data
- **Real-time listeners** are automatically cleaned up when users log out

Enjoy your real-time Finance Tracker! 🚀
