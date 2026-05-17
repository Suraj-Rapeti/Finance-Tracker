import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const GOALS_COLLECTION = 'goals';

// Add a new goal
export const addGoal = async (userId, goalData) => {
  try {
    const docRef = await addDoc(collection(db, GOALS_COLLECTION), {
      user_id: userId,
      ...goalData,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Add goal error:', error);
    throw error;
  }
};

// Update a goal
export const updateGoal = async (goalId, updates) => {
  try {
    await updateDoc(doc(db, GOALS_COLLECTION, goalId), {
      ...updates,
      updated_at: new Date(),
    });
  } catch (error) {
    console.error('Update goal error:', error);
    throw error;
  }
};

// Delete a goal
export const deleteGoal = async (goalId) => {
  try {
    await deleteDoc(doc(db, GOALS_COLLECTION, goalId));
  } catch (error) {
    console.error('Delete goal error:', error);
    throw error;
  }
};

// Get all goals for a user (one-time fetch)
export const getGoals = async (userId) => {
  try {
    const q = query(
      collection(db, GOALS_COLLECTION),
      where('user_id', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Get goals error:', error);
    throw error;
  }
};

// Real-time listener for goals
export const watchGoals = (userId, callback) => {
  try {
    const q = query(
      collection(db, GOALS_COLLECTION),
      where('user_id', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(goals);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Watch goals error:', error);
    throw error;
  }
};
