import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth } from '../config/firebase';
import * as transactionService from '../services/transactionService';
import * as budgetService from '../services/budgetService';
import * as goalService from '../services/goalService';
import * as billService from '../services/billService';
import { getUserProfile } from '../services/authService';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [bills, setBills] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Store unsubscribe functions to clean them up later
  const unsubscribersRef = useRef({});

  // Set up real-time listeners when user logs in
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Data loading timed out');
        setLoading(false);
      }
    }, 8000);

    const unsubscribeAuth = auth.onAuthStateChanged(async (authUser) => {
      // Clean up previous listeners if they exist
      if (unsubscribersRef.current.transactions) {
        unsubscribersRef.current.transactions();
      }
      if (unsubscribersRef.current.budgets) {
        unsubscribersRef.current.budgets();
      }
      if (unsubscribersRef.current.goals) {
        unsubscribersRef.current.goals();
      }
      if (unsubscribersRef.current.bills) {
        unsubscribersRef.current.bills();
      }

      if (authUser) {
        try {
          // Fetch user profile
          const profile = await getUserProfile(authUser.uid);
          setUser(profile ? {
            ...profile,
            uid: authUser.uid,  // Always set uid from auth
          } : {
            uid: authUser.uid,
            email: authUser.email,
            name: authUser.displayName || '',
            avatar: null,
            plan: 'Free',
          });

          // Set up real-time listeners for transactions, budgets, goals, and bills
          unsubscribersRef.current.transactions = transactionService.watchTransactions(
            authUser.uid,
            setTransactions
          );
          unsubscribersRef.current.budgets = budgetService.watchBudgets(
            authUser.uid,
            setBudgets
          );
          unsubscribersRef.current.goals = goalService.watchGoals(
            authUser.uid,
            setGoals
          );
          unsubscribersRef.current.bills = billService.watchBills(
            authUser.uid,
            setBills
          );

          setLoading(false);
        } catch (err) {
          console.error('Error loading user data:', err);
          setError(err.message);
          setLoading(false);
        }
      } else {
        setUser(null);
        setTransactions([]);
        setBudgets([]);
        setGoals([]);
        setBills([]);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribeAuth();
      // Clean up listeners on unmount
      if (unsubscribersRef.current.transactions) {
        unsubscribersRef.current.transactions();
      }
      if (unsubscribersRef.current.budgets) {
        unsubscribersRef.current.budgets();
      }
      if (unsubscribersRef.current.goals) {
        unsubscribersRef.current.goals();
      }
      if (unsubscribersRef.current.bills) {
        unsubscribersRef.current.bills();
      }
    };
  }, []);

  // Computed financials
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  );
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  // Transaction operations
  const addTransaction = async (transaction) => {
    if (!user?.uid) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }
    try {
      await transactionService.addTransaction(user.uid, transaction);
    } catch (err) {
      setError(err.message);
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      await transactionService.updateTransaction(id, updates);
    } catch (err) {
      setError(err.message);
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting transaction:', err);
      throw err;
    }
  };

  // Goal operations
  const addGoal = async (goal) => {
    if (!user?.uid) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }
    try {
      await goalService.addGoal(user.uid, goal);
    } catch (err) {
      setError(err.message);
      console.error('Error adding goal:', err);
      throw err;
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      await goalService.updateGoal(id, updates);
    } catch (err) {
      setError(err.message);
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await goalService.deleteGoal(id);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  // Budget operations
  const addBudget = async (budget) => {
    if (!user?.uid) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }
    try {
      await budgetService.addBudget(user.uid, budget);
    } catch (err) {
      setError(err.message);
      console.error('Error adding budget:', err);
      throw err;
    }
  };

  const updateBudget = async (id, updates) => {
    try {
      await budgetService.updateBudget(id, updates);
    } catch (err) {
      setError(err.message);
      console.error('Error updating budget:', err);
      throw err;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await budgetService.deleteBudget(id);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting budget:', err);
      throw err;
    }
  };

  // Bill operations
  const addBill = async (bill) => {
    if (!user?.uid) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }
    try {
      await billService.addBill(user.uid, bill);
    } catch (err) {
      setError(err.message);
      console.error('Error adding bill:', err);
      throw err;
    }
  };

  const updateBill = async (id, updates) => {
    try {
      await billService.updateBill(id, updates);
    } catch (err) {
      setError(err.message);
      console.error('Error updating bill:', err);
      throw err;
    }
  };

  const deleteBill = async (id) => {
    try {
      await billService.deleteBill(id);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting bill:', err);
      throw err;
    }
  };

  const addChatMessage = (message) => {
    setChatMessages(prev => [...prev, { ...message, id: Date.now(), timestamp: new Date() }]);
  };


  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      goals,
      bills,
      chatMessages,
      sidebarOpen,
      setSidebarOpen,
      user,
      loading,
      error,
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addBudget,
      updateBudget,
      deleteBudget,
      addBill,
      updateBill,
      deleteBill,
      addChatMessage,
      setBudgets,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};
