// Mock data for the finance tracker app

export const mockTransactions = [
  { id: 1, title: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: '2026-05-10', type: 'expense', method: 'Card', icon: '🎬' },
  { id: 2, title: 'Salary Deposit', category: 'Income', amount: 5500, date: '2026-05-01', type: 'income', method: 'Bank Transfer', icon: '💰' },
  { id: 3, title: 'Whole Foods Market', category: 'Food & Grocery', amount: -127.45, date: '2026-05-09', type: 'expense', method: 'Card', icon: '🛒' },
  { id: 4, title: 'Uber Ride', category: 'Transport', amount: -24.50, date: '2026-05-09', type: 'expense', method: 'Card', icon: '🚗' },
  { id: 5, title: 'Freelance Payment', category: 'Income', amount: 850, date: '2026-05-08', type: 'income', method: 'PayPal', icon: '💻' },
  { id: 6, title: 'Electricity Bill', category: 'Utilities', amount: -89.20, date: '2026-05-07', type: 'expense', method: 'Auto-pay', icon: '⚡' },
  { id: 7, title: 'Amazon Purchase', category: 'Shopping', amount: -156.30, date: '2026-05-06', type: 'expense', method: 'Card', icon: '📦' },
  { id: 8, title: 'Gym Membership', category: 'Health', amount: -45.00, date: '2026-05-05', type: 'expense', method: 'Card', icon: '💪' },
  { id: 9, title: 'Restaurant Dinner', category: 'Food & Grocery', amount: -68.90, date: '2026-05-04', type: 'expense', method: 'Cash', icon: '🍽️' },
  { id: 10, title: 'Spotify Premium', category: 'Entertainment', amount: -9.99, date: '2026-05-03', type: 'expense', method: 'Card', icon: '🎵' },
  { id: 11, title: 'Investment Return', category: 'Investment', amount: 320.00, date: '2026-05-02', type: 'income', method: 'Bank Transfer', icon: '📈' },
  { id: 12, title: 'Internet Bill', category: 'Utilities', amount: -59.99, date: '2026-05-01', type: 'expense', method: 'Auto-pay', icon: '🌐' },
  { id: 13, title: 'Coffee Shop', category: 'Food & Grocery', amount: -12.50, date: '2026-04-30', type: 'expense', method: 'Card', icon: '☕' },
  { id: 14, title: 'Book Purchase', category: 'Education', amount: -28.00, date: '2026-04-29', type: 'expense', method: 'Card', icon: '📚' },
  { id: 15, title: 'Dividend Income', category: 'Investment', amount: 145.00, date: '2026-04-28', type: 'income', method: 'Bank Transfer', icon: '💹' },
];

export const mockMonthlyData = [
  { month: 'Nov', income: 6200, expenses: 3800, savings: 2400 },
  { month: 'Dec', income: 7100, expenses: 4500, savings: 2600 },
  { month: 'Jan', income: 5800, expenses: 3600, savings: 2200 },
  { month: 'Feb', income: 6500, expenses: 4100, savings: 2400 },
  { month: 'Mar', income: 6800, expenses: 3900, savings: 2900 },
  { month: 'Apr', income: 6300, expenses: 4300, savings: 2000 },
  { month: 'May', income: 6670, expenses: 4050, savings: 2620 },
];

export const mockExpenseCategories = [
  { name: 'Food & Grocery', value: 890, color: '#10B981', percentage: 28 },
  { name: 'Transport', value: 420, color: '#0EA5E9', percentage: 13 },
  { name: 'Entertainment', value: 320, color: '#8B5CF6', percentage: 10 },
  { name: 'Utilities', value: 380, color: '#F59E0B', percentage: 12 },
  { name: 'Shopping', value: 560, color: '#F43F5E', percentage: 17 },
  { name: 'Health', value: 280, color: '#34D399', percentage: 9 },
  { name: 'Education', value: 200, color: '#38BDF8', percentage: 6 },
  { name: 'Other', value: 160, color: '#94A3B8', percentage: 5 },
];

export const mockBudgets = [
  { id: 1, category: 'Food & Grocery', limit: 1000, spent: 890, color: '#10B981', icon: '🛒' },
  { id: 2, category: 'Transport', limit: 500, spent: 420, color: '#0EA5E9', icon: '🚗' },
  { id: 3, category: 'Entertainment', limit: 300, spent: 320, color: '#8B5CF6', icon: '🎬' },
  { id: 4, category: 'Shopping', limit: 600, spent: 560, color: '#F43F5E', icon: '🛍️' },
  { id: 5, category: 'Utilities', limit: 400, spent: 380, color: '#F59E0B', icon: '⚡' },
  { id: 6, category: 'Health', limit: 350, spent: 280, color: '#34D399', icon: '💪' },
];

export const mockGoals = [
  { id: 1, title: 'Emergency Fund', target: 10000, current: 6800, deadline: '2026-12-31', color: '#10B981', icon: '🛡️' },
  { id: 2, title: 'New Laptop', target: 2500, current: 1750, deadline: '2026-07-15', color: '#0EA5E9', icon: '💻' },
  { id: 3, title: 'Europe Trip', target: 8000, current: 3200, deadline: '2027-06-01', color: '#8B5CF6', icon: '✈️' },
  { id: 4, title: 'Car Down Payment', target: 15000, current: 9500, deadline: '2027-01-01', color: '#F59E0B', icon: '🚗' },
  { id: 5, title: 'Home Renovation', target: 20000, current: 4800, deadline: '2027-12-31', color: '#F43F5E', icon: '🏠' },
];

export const mockUpcomingBills = [
  { id: 1, title: 'Rent', amount: 1500, dueDate: '2026-06-01', category: 'Housing', icon: '🏠' },
  { id: 2, title: 'Car Insurance', amount: 180, dueDate: '2026-05-15', category: 'Insurance', icon: '🚗' },
  { id: 3, title: 'Phone Bill', amount: 65, dueDate: '2026-05-18', category: 'Utilities', icon: '📱' },
  { id: 4, title: 'Netflix', amount: 15.99, dueDate: '2026-05-20', category: 'Entertainment', icon: '🎬' },
  { id: 5, title: 'Gym', amount: 45, dueDate: '2026-05-25', category: 'Health', icon: '💪' },
];

export const mockWeeklySpending = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 120 },
  { day: 'Wed', amount: 78 },
  { day: 'Thu', amount: 210 },
  { day: 'Fri', amount: 165 },
  { day: 'Sat', amount: 280 },
  { day: 'Sun', amount: 95 },
];

export const mockChatMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m your AI financial advisor. I\'ve analyzed your spending patterns and I\'m ready to help you achieve your financial goals. What would you like to know?',
    timestamp: new Date(Date.now() - 3600000),
  }
];

export const mockReports = [
  { month: 'January 2026', income: 5800, expenses: 3600, savings: 2200, savingsRate: 37.9 },
  { month: 'February 2026', income: 6500, expenses: 4100, savings: 2400, savingsRate: 36.9 },
  { month: 'March 2026', income: 6800, expenses: 3900, savings: 2900, savingsRate: 42.6 },
  { month: 'April 2026', income: 6300, expenses: 4300, savings: 2000, savingsRate: 31.7 },
  { month: 'May 2026', income: 6670, expenses: 4050, savings: 2620, savingsRate: 39.3 },
];
