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

const BUDGETS_COLLECTION = 'budgets';

// Add a new budget
export const addBudget = async (userId, budgetData) => {
  try {
    const docRef = await addDoc(collection(db, BUDGETS_COLLECTION), {
      user_id: userId,
      ...budgetData,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Add budget error:', error);
    throw error;
  }
};

// Update a budget
export const updateBudget = async (budgetId, updates) => {
  try {
    await updateDoc(doc(db, BUDGETS_COLLECTION, budgetId), {
      ...updates,
      updated_at: new Date(),
    });
  } catch (error) {
    console.error('Update budget error:', error);
    throw error;
  }
};

// Delete a budget
export const deleteBudget = async (budgetId) => {
  try {
    await deleteDoc(doc(db, BUDGETS_COLLECTION, budgetId));
  } catch (error) {
    console.error('Delete budget error:', error);
    throw error;
  }
};

// Get all budgets for a user (one-time fetch)
export const getBudgets = async (userId) => {
  try {
    const q = query(
      collection(db, BUDGETS_COLLECTION),
      where('user_id', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Get budgets error:', error);
    throw error;
  }
};

// Real-time listener for budgets
export const watchBudgets = (userId, callback) => {
  try {
    const q = query(
      collection(db, BUDGETS_COLLECTION),
      where('user_id', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(budgets);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Watch budgets error:', error);
    throw error;
  }
};
