import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const TRANSACTIONS_COLLECTION = 'transactions';

// Add a new transaction
export const addTransaction = async (userId, transactionData) => {
  try {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      user_id: userId,
      ...transactionData,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Add transaction error:', error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (transactionId, updates) => {
  try {
    await updateDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId), {
      ...updates,
      updated_at: new Date(),
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, transactionId));
  } catch (error) {
    console.error('Delete transaction error:', error);
    throw error;
  }
};

// Get all transactions for a user (one-time fetch)
export const getTransactions = async (userId) => {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('user_id', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Get transactions error:', error);
    throw error;
  }
};

// Real-time listener for transactions
export const watchTransactions = (userId, callback) => {
  try {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('user_id', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(transactions);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Watch transactions error:', error);
    throw error;
  }
};

// Batch delete transactions
export const deleteMultipleTransactions = async (transactionIds) => {
  try {
    const batch = writeBatch(db);
    transactionIds.forEach(id => {
      batch.delete(doc(db, TRANSACTIONS_COLLECTION, id));
    });
    await batch.commit();
  } catch (error) {
    console.error('Delete multiple transactions error:', error);
    throw error;
  }
};
