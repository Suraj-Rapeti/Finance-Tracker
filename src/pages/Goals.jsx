import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Card, CardHeader, CardContent, ProgressBar, Badge, SectionTitle } from '../components/ui';
import { PageWrapper, staggerContainer, staggerItem } from '../animations/variants.jsx';
import { formatCurrency } from '../utils/formatters';
import { useFinance } from '../context/FinanceContext';
import { toast } from 'sonner';

const GoalModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({ title: '', target: '', current: '', deadline: '', icon: '🎯', color: '#10B981' });

  const COLORS = ['#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#F43F5E', '#34D399'];
  const ICONS = ['🎯', '✈️', '🚗', '🏠', '💻', '💍', '🎓', '💪', '🛡️', '📱'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, target: parseFloat(form.target), current: parseFloat(form.current || 0) });
    setForm({ title: '', target: '', current: '', deadline: '', icon: '🎯', color: '#10B981' });
    onClose();
    toast.success('Goal created!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 modal-overlay" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-card border border-white/[0.12] z-10"
          >
            <div className="p-5 border-b border-white/[0.06]">
              <h3 className="text-white font-semibold">New Savings Goal</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Goal Title</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Emergency Fund" className="input-glass" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs mb-1.5 block">Target ($)</label>
                  <input type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                    placeholder="10000" className="input-glass" required min="1" />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1.5 block">Saved so far ($)</label>
                  <input type="number" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
                    placeholder="0" className="input-glass" min="0" />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="input-glass" style={{ colorScheme: 'dark' }} required />
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {ICONS.map(icon => (
                    <button key={icon} type="button" onClick={() => setForm(f => ({ ...f, icon }))}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                        form.icon === icon ? 'bg-white/15 ring-2 ring-white/30' : 'bg-white/[0.04] hover:bg-white/[0.08]'
                      }`}>{icon}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs mb-1.5 block">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setForm(f => ({ ...f, color }))}
                      className={`w-7 h-7 rounded-full transition-all ${form.color === color ? 'ring-2 ring-white/50 scale-110' : ''}`}
                      style={{ background: color }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Create Goal</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Goals = () => {
  const { goals, addGoal, deleteGoal } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);

  const totalSaved = goals.reduce((s, g) => s + g.current, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const completed = goals.filter(g => g.current >= g.target).length;

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
        {/* Summary */}
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Total Goals</p>
            <p className="text-white text-2xl font-bold">{goals.length}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Total Saved</p>
            <p className="text-emerald-400 text-2xl font-bold">{formatCurrency(totalSaved)}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Completed</p>
            <p className="text-violet-400 text-2xl font-bold">{completed}</p>
          </div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div variants={staggerItem} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-semibold">Overall Progress</p>
              <p className="text-white/40 text-xs">{formatCurrency(totalSaved)} of {formatCurrency(totalTarget)}</p>
            </div>
            <span className="text-2xl font-bold gradient-text">{Math.round((totalSaved / totalTarget) * 100)}%</span>
          </div>
          <ProgressBar value={totalSaved} max={totalTarget} color="#10B981" />
        </motion.div>

        {/* Goal Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {goals.map((goal, i) => {
              const pct = Math.round((goal.current / goal.target) * 100);
              const daysLeft = differenceInDays(parseISO(goal.deadline), new Date());
              const isComplete = goal.current >= goal.target;
              const monthlySave = daysLeft > 0 ? ((goal.target - goal.current) / (daysLeft / 30)).toFixed(0) : 0;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-card p-5 relative group"
                >
                  {isComplete && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle size={20} className="text-emerald-400" />
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${goal.color}18`, border: `1px solid ${goal.color}30` }}>
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{goal.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={11} className="text-white/30" />
                        <span className="text-white/35 text-xs">
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/60">{formatCurrency(goal.current)} saved</span>
                      <span className="font-semibold" style={{ color: goal.color }}>{pct}%</span>
                    </div>
                    <ProgressBar value={goal.current} max={goal.target} color={goal.color} />
                    <p className="text-white/30 text-xs mt-1">Target: {formatCurrency(goal.target)}</p>
                  </div>

                  {!isComplete && monthlySave > 0 && (
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-white/40 text-xs">Save <span className="text-white/70 font-semibold">{formatCurrency(monthlySave)}/mo</span> to reach goal</p>
                    </div>
                  )}

                  {isComplete && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-emerald-400 text-xs font-semibold">🎉 Goal achieved!</p>
                    </div>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => { deleteGoal(goal.id); toast.success('Goal removed'); }}
                    className="absolute bottom-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 text-white/30 hover:text-rose-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 btn-primary shadow-glow rounded-2xl p-4 z-30"
      >
        <Plus size={22} />
      </motion.button>

      <GoalModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onAdd={addGoal} />
    </PageWrapper>
  );
};
