import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Sign up a new user
export const signUp = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      name: userData.name || '',
      avatar: userData.avatar || null,
      plan: userData.plan || 'Free',
      created_at: new Date(),
      updated_at: new Date(),
    });

    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    // Enable persistence
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    // Enable persistence
    await setPersistence(auth, browserLocalPersistence);
    
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    // Create user profile in Firestore if it doesn't exist
    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        name: user.displayName || '',
        avatar: user.photoURL || null,
        plan: 'Free',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid, updates) => {
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        ...updates,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

// Watch auth state changes
export const watchAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
