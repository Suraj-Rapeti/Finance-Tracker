import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { useFinance } from '../context/FinanceContext';

const CATEGORIES = [
  'Food & Grocery', 'Transport', 'Entertainment', 'Utilities',
  'Shopping', 'Health', 'Education', 'Investment', 'Income', 'Other'
];

const PAYMENT_METHODS = ['Card', 'Cash', 'Bank Transfer', 'PayPal', 'Auto-pay', 'UPI'];

const ICONS = {
  'Food & Grocery': '🛒', 'Transport': '🚗', 'Entertainment': '🎬',
  'Utilities': '⚡', 'Shopping': '🛍️', 'Health': '💪',
  'Education': '📚', 'Investment': '📈', 'Income': '💰', 'Other': '📌'
};

const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

export const TransactionModal = ({ isOpen, onClose, editTransaction = null }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const [form, setForm] = useState({
    title: '', amount: '', type: 'expense', category: 'Food & Grocery',
    method: 'Card', date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTransaction) {
      setForm({
        title: editTransaction.title,
        amount: Math.abs(editTransaction.amount).toString(),
        type: editTransaction.type,
        category: editTransaction.category,
        method: editTransaction.method,
        date: editTransaction.date,
      });
    } else {
      setForm({
        title: '', amount: '', type: 'expense', category: 'Food & Grocery',
        method: 'Card', date: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [editTransaction, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const txn = {
      ...form,
      amount: form.type === 'expense' ? -parseFloat(form.amount) : parseFloat(form.amount),
      icon: ICONS[form.category] || '📌',
    };

    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, txn);
        toast.success('Transaction updated!');
      } else {
        await addTransaction(txn);
        toast.success('Transaction added!');
      }
      onClose();
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleQuickAmount = (amount) => {
    setForm(f => ({ ...f, amount: amount.toString() }));
    setErrors(e => ({ ...e, amount: '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md glass-card border border-white/[0.12] shadow-card z-10 overflow-hidden"
          >
            {/* Header with gradient background */}
            <div className="relative p-5 border-b border-white/[0.06] bg-gradient-to-r from-emerald-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${form.type === 'income' ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-rose-500/15 border-rose-500/30'}`}>
                    {form.type === 'income' ? (
                      <TrendingUp size={18} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={18} className="text-rose-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{editTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>
                    <p className="text-white/40 text-xs">Manage your {form.type}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Type Toggle - More Prominent */}
              <div className="space-y-2">
                <label className="text-white/50 text-xs font-semibold block uppercase tracking-wide">Transaction Type</label>
                <div className="flex gap-2 bg-white/[0.02] rounded-xl p-1.5">
                  {[
                    { type: 'expense', label: 'Expense', color: 'rose' },
                    { type: 'income', label: 'Income', color: 'emerald' }
                  ].map(({ type, label, color }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, type })); setErrors({}); }}
                      className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        form.type === type
                          ? `bg-${color}-500/25 text-${color}-400 border border-${color}-500/40 shadow-lg`
                          : 'text-white/40 hover:text-white/60 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {type === 'expense' ? '💸' : '💰'} {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-semibold block">Description</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => { setForm(f => ({ ...f, title: e.target.value })); setErrors(e => ({ ...e, title: '' })); }}
                  placeholder={form.type === 'income' ? 'e.g. Salary, Freelance work' : 'e.g. Netflix, Groceries'}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border ${errors.title ? 'border-rose-500/50' : 'border-white/[0.1]'} text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all`}
                />
                {errors.title && <p className="text-rose-400 text-xs">{errors.title}</p>}
              </div>

              {/* Amount Section */}
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-semibold block">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-white/40 text-lg">₹</span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); setErrors(e => ({ ...e, amount: '' })); }}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2.5 rounded-lg bg-white/[0.05] border ${errors.amount ? 'border-rose-500/50' : 'border-white/[0.1]'} text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all text-lg font-semibold`}
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.amount && <p className="text-rose-400 text-xs">{errors.amount}</p>}
                
                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {QUICK_AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickAmount(amt)}
                      className="px-3 py-1.5 text-xs bg-white/[0.06] hover:bg-emerald-500/20 border border-white/[0.08] hover:border-emerald-500/30 text-white/70 hover:text-emerald-400 rounded-lg transition-all"
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category - Visual Picker */}
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-semibold block">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} style={{ background: '#0D1120' }}>
                      {ICONS[c]} {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Method & Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-white/60 text-xs font-semibold block">Payment Method</label>
                  <select
                    value={form.method}
                    onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
                  >
                    {PAYMENT_METHODS.map(m => <option key={m} value={m} style={{ background: '#0D1120' }}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-white/60 text-xs font-semibold block">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 py-2.5 px-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-white/70 hover:text-white font-semibold transition-all border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-semibold transition-all border border-emerald-500/30 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-500/20"
                >
                  {editTransaction ? '✓ Update' : '+ Add Transaction'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
