import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Pencil, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Badge, Card, CardHeader, CardContent, SectionTitle } from '../components/ui';
import { TransactionModal } from '../components/TransactionModal';
import { PageWrapper, staggerContainer, staggerItem } from '../animations/variants.jsx';
import { toast } from 'sonner';

const CATEGORY_FILTERS = ['All', 'Food & Grocery', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Income', 'Investment', 'Education'];

export const Transactions = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = transactions.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchFrom = !dateFrom || t.date >= dateFrom;
    const matchTo = !dateTo || t.date <= dateTo;
    return matchSearch && matchCat && matchType && matchFrom && matchTo;
  }).sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = Math.abs(filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

  const handleEdit = (txn) => {
    setEditTxn(txn);
    setModalOpen(true);
  };

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">

        {/* Summary */}
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Total Transactions</p>
            <p className="text-white text-2xl font-bold">{filtered.length}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Total Income</p>
            <p className="text-emerald-400 text-2xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Total Expenses</p>
            <p className="text-rose-400 text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem} className="glass-card p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-glass pl-9"
              />
            </div>

            <div className="flex bg-white/[0.04] rounded-xl p-1 gap-1">
              {[['all', 'All'], ['income', 'Income'], ['expense', 'Expense']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTypeFilter(val)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    typeFilter === val ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="input-glass text-xs w-36"
                style={{ colorScheme: 'dark' }}
              />
              <span className="text-white/30 text-xs">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="input-glass text-xs w-36"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORY_FILTERS.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  categoryFilter === cat
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/[0.03] text-white/40 border-white/[0.06] hover:border-white/15 hover:text-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle={`${filtered.length} transactions`}>
                Transaction History
              </SectionTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Transaction', 'Category', 'Date', 'Method', 'Amount', 'Actions'].map(h => (
                      <th key={h} className="text-left text-white/35 text-xs font-medium px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn, i) => (
                    <motion.tr
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-base flex-shrink-0">
                            {txn.icon}
                          </div>
                          <div>
                            <p className="text-white/85 text-sm font-medium">{txn.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="default">{txn.category}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-white/45 text-sm">{formatDate(txn.date)}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant="default">{txn.method}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {txn.type === 'income'
                            ? <ArrowUpRight size={14} className="text-emerald-400" />
                            : <ArrowDownRight size={14} className="text-rose-400" />
                          }
                          <span className={`font-semibold text-sm ${txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(Math.abs(txn.amount))}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(txn)}
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/40 hover:text-white transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-white/40 hover:text-rose-400 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-sm">No transactions found</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

      </motion.div>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setEditTxn(null); setModalOpen(true); }}
        className="fixed bottom-6 right-6 btn-primary shadow-glow rounded-2xl p-4 z-30"
      >
        <Plus size={22} />
      </motion.button>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTxn(null); }}
        editTransaction={editTxn}
      />
    </PageWrapper>
  );
};
