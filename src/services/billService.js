import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const BILLS_COLLECTION = 'bills';

export const addBill = async (userId, billData) => {
  try {
    const docRef = await addDoc(collection(db, BILLS_COLLECTION), {
      user_id: userId,
      ...billData,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Add bill error:', error);
    throw error;
  }
};

export const updateBill = async (billId, updates) => {
  try {
    await updateDoc(doc(db, BILLS_COLLECTION, billId), {
      ...updates,
      updated_at: new Date(),
    });
  } catch (error) {
    console.error('Update bill error:', error);
    throw error;
  }
};

export const deleteBill = async (billId) => {
  try {
    await deleteDoc(doc(db, BILLS_COLLECTION, billId));
  } catch (error) {
    console.error('Delete bill error:', error);
    throw error;
  }
};

export const getBills = async (userId) => {
  try {
    const q = query(
      collection(db, BILLS_COLLECTION),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Get bills error:', error);
    throw error;
  }
};

export const watchBills = (userId, callback) => {
  try {
    const q = query(
      collection(db, BILLS_COLLECTION),
      where('user_id', '==', userId)
    );
    return onSnapshot(q, (querySnapshot) => {
      const bills = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(bills);
    });
  } catch (error) {
    console.error('Watch bills error:', error);
    throw error;
  }
};
