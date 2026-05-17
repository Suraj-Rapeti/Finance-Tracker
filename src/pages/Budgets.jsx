import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, PlusCircle, Lightbulb } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardContent, Badge, ProgressBar, SectionTitle } from '../components/ui';
import { PageWrapper, staggerContainer, staggerItem } from '../animations/variants.jsx';
import { formatCurrency } from '../utils/formatters';
import { useFinance } from '../context/FinanceContext';

const CircularProgress = ({ percentage, color, size = 80 }) => {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={10} fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={percentage > 100 ? '#F43F5E' : color}
        strokeWidth={10} fill="none"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        strokeLinecap="round"
      />
    </svg>
  );
};

const RECOMMENDATION_ICONS = {
  'Food & Grocery': '🛒',
  'Transport': '🚗',
  'Entertainment': '🎬',
  'Utilities': '⚡',
  'Shopping': '🛍️',
  'Health': '💪',
  'Education': '📚',
  'Investment': '📈',
  'Other': '💡'
};

const generateSmartRecommendations = (transactions, budgets) => {
  const recommendations = [];

  // Analyze each category
  budgets.forEach(budget => {
    const categoryTransactions = transactions.filter(t => t.type === 'expense' && t.category === budget.category);
    const totalSpent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    if (totalSpent === 0) return;

    const utilizationPercent = (totalSpent / budget.limit) * 100;
    const icon = RECOMMENDATION_ICONS[budget.category] || '💡';

    // Recommendation 1: Over budget
    if (totalSpent > budget.limit) {
      const overage = totalSpent - budget.limit;
      const avgTransaction = categoryTransactions.length > 0 ? totalSpent / categoryTransactions.length : 0;
      const potentialSaving = Math.ceil(avgTransaction * 0.2); // Suggest 20% reduction
      
      recommendations.push({
        icon,
        text: `Reduce ${budget.category} spending by cutting non-essential purchases`,
        saving: Math.min(potentialSaving, Math.ceil(overage)),
        priority: 'high'
      });
    }
    
    // Recommendation 2: High utilization (75-99%)
    else if (utilizationPercent > 75) {
      const remaining = budget.limit - totalSpent;
      const avgTransaction = categoryTransactions.length > 0 ? totalSpent / categoryTransactions.length : 0;
      const potentialSaving = Math.ceil(avgTransaction * 0.15);
      
      recommendations.push({
        icon,
        text: `Monitor ${budget.category} spending closely - you're at ${Math.round(utilizationPercent)}% of budget`,
        saving: potentialSaving,
        priority: 'medium'
      });
    }
  });

  // General recommendations based on overall spending
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (totalExpenses > 0) {
    // Find highest spending category
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
      });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const percentOfTotal = (topAmount / totalExpenses) * 100;

      if (percentOfTotal > 30) {
        const potentialSaving = Math.ceil(topAmount * 0.1);
        recommendations.push({
          icon: RECOMMENDATION_ICONS[topCategory] || '💡',
          text: `${topCategory} is ${Math.round(percentOfTotal)}% of your spending. Small cuts here add up!`,
          saving: potentialSaving,
          priority: 'medium'
        });
      }
    }
  }

  // If no specific recommendations, provide general advice
  if (recommendations.length === 0) {
    recommendations.push({
      icon: '💚',
      text: 'Great job! Your spending is within budget. Keep tracking regularly.',
      saving: 0,
      priority: 'low'
    });
  }

  return recommendations.slice(0, 4); // Return top 4 recommendations
};

export const Budgets = () => {
  const { budgets, transactions } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);

  const overBudget = budgets.filter(b => b.spent > b.limit);
  const onTrack = budgets.filter(b => b.spent <= b.limit);
  
  // Generate smart recommendations
  const smartRecommendations = generateSmartRecommendations(transactions, budgets);

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
        {/* Alert Banner */}
        {overBudget.length > 0 && (
          <motion.div
            variants={staggerItem}
            className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25"
          >
            <AlertTriangle size={20} className="text-rose-400 flex-shrink-0" />
            <div>
              <p className="text-rose-400 font-semibold text-sm">Budget Alert</p>
              <p className="text-white/50 text-xs">
                {overBudget.map(b => b.category).join(', ')} budget{overBudget.length > 1 ? 's' : ''} exceeded
              </p>
            </div>
          </motion.div>
        )}

        {/* Summary Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Total Budget</p>
            <p className="text-white text-xl font-bold">{formatCurrency(budgets.reduce((s, b) => s + b.limit, 0))}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Total Spent</p>
            <p className="text-rose-400 text-xl font-bold">{formatCurrency(budgets.reduce((s, b) => s + b.spent, 0))}</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-white/40 text-xs mb-1">Remaining</p>
            <p className="text-emerald-400 text-xl font-bold">{formatCurrency(budgets.reduce((s, b) => s + Math.max(b.limit - b.spent, 0), 0))}</p>
          </div>
        </motion.div>

        {/* Budget Cards Grid */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget, i) => {
            const pct = Math.round((budget.spent / budget.limit) * 100);
            const isOver = budget.spent > budget.limit;
            const remaining = budget.limit - budget.spent;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass-card p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{budget.icon}</span>
                    <div>
                      <p className="text-white/80 font-semibold text-sm">{budget.category}</p>
                      <p className="text-white/35 text-xs">{isOver ? 'Over budget' : `${formatCurrency(remaining)} remaining`}</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <CircularProgress percentage={pct} color={budget.color} size={72} />
                    <div className="absolute text-center">
                      <p className="text-white font-bold text-sm leading-none">{Math.min(pct, 999)}%</p>
                    </div>
                  </div>
                </div>

                <ProgressBar value={budget.spent} max={budget.limit} color={budget.color} />
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span className={isOver ? 'text-rose-400' : ''}>{formatCurrency(budget.spent)} spent</span>
                  <span>{formatCurrency(budget.limit)} limit</span>
                </div>

                {isOver && (
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <AlertTriangle size={12} className="text-rose-400" />
                    <span className="text-rose-400 text-xs font-medium">
                      {formatCurrency(budget.spent - budget.limit)} over limit
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Smart Recommendations */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-amber-400" />
                <span className="text-white font-semibold">Smart Recommendations</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {smartRecommendations.map((rec, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/20 transition-all group"
                  >
                    <span className="text-2xl">{rec.icon}</span>
                    <div className="flex-1">
                      <p className="text-white/75 text-sm">{rec.text}</p>
                    </div>
                    {rec.saving > 0 && <Badge variant="emerald">+₹{Math.round(rec.saving).toLocaleString()}/mo</Badge>}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};
