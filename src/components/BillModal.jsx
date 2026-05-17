import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useFinance } from '../context/FinanceContext';

const BILL_CATEGORIES = ['Housing', 'Utilities', 'Insurance', 'Entertainment', 'Health', 'Education', 'Transport', 'Other'];

const BILL_ICONS = {
  'Housing': '🏠',
  'Utilities': '⚡',
  'Insurance': '🛡️',
  'Entertainment': '🎬',
  'Health': '💊',
  'Education': '📚',
  'Transport': '🚗',
  'Other': '📌'
};

export const BillModal = ({ isOpen, onClose, editBill = null }) => {
  const { addBill, updateBill } = useFinance();
  const [form, setForm] = useState({
    title: '',
    amount: '',
    dueDate: '',
    category: 'Utilities',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editBill) {
      setForm({
        title: editBill.title,
        amount: editBill.amount.toString(),
        dueDate: editBill.dueDate,
        category: editBill.category,
      });
    } else {
      setForm({
        title: '',
        amount: '',
        dueDate: '',
        category: 'Utilities',
      });
    }
    setErrors({});
  }, [editBill, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title required';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Valid amount required';
    if (!form.dueDate) newErrors.dueDate = 'Due date required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const billData = {
        title: form.title,
        amount: parseFloat(form.amount),
        dueDate: form.dueDate,
        category: form.category,
        icon: BILL_ICONS[form.category] || '📌',
      };

      if (editBill) {
        await updateBill(editBill.id, billData);
        toast.success('Bill updated successfully!');
      } else {
        await addBill(billData);
        toast.success('Bill added successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save bill');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card rounded-2xl p-6 w-full max-w-md border border-white/[0.1]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{editBill ? 'Edit Bill' : 'Add New Bill'}</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/[0.1] rounded-lg transition-colors text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/50 text-xs font-medium mb-1.5 block">Bill Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g., Electricity Bill"
                className={`input-glass w-full ${errors.title ? 'border-red-500/50' : ''}`}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  step="0.01"
                  className={`input-glass w-full ${errors.amount ? 'border-red-500/50' : ''}`}
                />
                {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
              </div>
              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="input-glass w-full"
                >
                  {BILL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-white/50 text-xs font-medium mb-1.5 block">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className={`input-glass w-full ${errors.dueDate ? 'border-red-500/50' : ''}`}
              />
              {errors.dueDate && <p className="text-red-400 text-xs mt-1">{errors.dueDate}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 justify-center"
              >
                {editBill ? 'Update Bill' : 'Add Bill'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
