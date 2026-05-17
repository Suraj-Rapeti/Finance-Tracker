import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Download, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardContent, SectionTitle, Badge } from '../components/ui';
import { PageWrapper, staggerContainer, staggerItem } from '../animations/variants.jsx';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 border border-white/[0.12]">
      <p className="text-white/60 text-xs mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="text-white font-semibold">{typeof p.value === 'number' && p.value > 100 ? `₹${p.value.toLocaleString()}` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const COLORS = ['#10B981', '#F43F5E', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EC4899', '#14B8A6', '#84CC16'];

export const Analytics = () => {
  const { transactions, budgets } = useFinance();

  // Helper function to get month name
  const getMonthName = (date) => {
    return new Date(date).toLocaleString('default', { month: 'short' });
  };

  // Calculate monthly data for last 6 months
  const calculateMonthlyData = () => {
    const months = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { month: getMonthName(d), income: 0, expenses: 0, savings: 0 };
    }

    transactions.forEach(t => {
      const date = new Date(t.date || t.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        if (t.type === 'income') months[key].income += t.amount;
        else months[key].expenses += Math.abs(t.amount);
      }
    });

    return Object.values(months).map(m => ({
      ...m,
      savings: m.income - m.expenses
    }));
  };

  // Calculate weekly data
  const calculateWeeklyData = () => {
    const week = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      week[key] = { day: days[d.getDay()], amount: 0 };
    }

    transactions.forEach(t => {
      const date = new Date(t.date || t.created_at);
      const key = date.toISOString().split('T')[0];
      if (week[key] && t.type === 'expense') {
        week[key].amount += Math.abs(t.amount);
      }
    });

    return Object.values(week);
  };

  // Calculate category breakdown
  const calculateCategoryData = () => {
    const categories = {};
    let total = 0;

    transactions.forEach(t => {
      if (t.type === 'expense') {
        if (!categories[t.category]) {
          categories[t.category] = 0;
        }
        const amount = Math.abs(t.amount);
        categories[t.category] += amount;
        total += amount;
      }
    });

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
        color: COLORS[Object.keys(categories).indexOf(name) % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate key metrics
  const calculateMetrics = () => {
    if (transactions.length === 0) {
      return {
        avgDailySpend: 0,
        largestExpense: 'N/A',
        topCategory: 'N/A',
        totalDays: 1,
        expenses: 0,
        categories: {}
      };
    }

    const expenses = transactions.filter(t => t.type === 'expense');
    const expensesByCategory = {};
    let largestAmount = 0;
    let largestExpenseName = 'N/A';

    expenses.forEach(t => {
      const amount = Math.abs(t.amount);
      if (!expensesByCategory[t.category]) {
        expensesByCategory[t.category] = 0;
      }
      expensesByCategory[t.category] += amount;

      if (amount > largestAmount) {
        largestAmount = amount;
        largestExpenseName = t.title;
      }
    });

    const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const dateRange = Math.ceil(
      (new Date(transactions.map(t => t.date || t.created_at).sort().reverse()[0]) - 
       new Date(transactions.map(t => t.date || t.created_at).sort()[0])) / (1000 * 60 * 60 * 24)
    ) || 1;

    return {
      avgDailySpend: Math.round(totalExpenses / dateRange),
      largestExpense: largestExpenseName,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      totalDays: dateRange,
      expenses: totalExpenses,
      categories: expensesByCategory
    };
  };

  // Calculate budget radar data
  const calculateBudgetRadar = () => {
    return budgets.map(b => ({
      subject: b.category,
      A: Math.round((b.spent / b.limit) * 100),
      fullMark: 100
    })).slice(0, 6);
  };

  const monthlyData = calculateMonthlyData();
  const weeklyData = calculateWeeklyData();
  const categoryData = calculateCategoryData();
  const metrics = calculateMetrics();
  const radarData = calculateBudgetRadar();

  const statCards = [
    { label: 'Avg Daily Spend', value: `₹${metrics.avgDailySpend.toLocaleString()}`, change: 'Last 30 days', color: 'text-rose-400' },
    { label: 'Largest Expense', value: metrics.largestExpense, change: 'Single transaction', color: 'text-amber-400' },
    { label: 'Total Spent', value: `₹${Math.round(metrics.expenses).toLocaleString()}`, change: 'All time', color: 'text-rose-500' },
    { label: 'Top Category', value: metrics.topCategory, change: 'By amount', color: 'text-sky-400' },
  ];
  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
        {/* Header with download */}
        <motion.div variants={staggerItem} className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl">Financial Analytics</h2>
            <p className="text-white/40 text-sm">Detailed insights into your spending patterns</p>
          </div>
          <button className="btn-ghost">
            <Download size={16} /> Export Report
          </button>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((m, i) => (
            <div key={i} className="glass-card p-4">
              <p className="text-white/40 text-xs mb-2">{m.label}</p>
              <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-white/30 text-xs mt-0.5">{m.change}</p>
            </div>
          ))}
        </motion.div>

        {/* Charts Row 1 */ }
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly Comparison Bar */}
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Income vs Expenses comparison">Monthly Comparison</SectionTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.85} name="Income" />
                  <Bar dataKey="expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} opacity={0.85} name="Expenses" />
                  <Bar dataKey="savings" fill="#8B5CF6" radius={[4, 4, 0, 0]} opacity={0.85} name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Spending */}
          <Card>
            <CardHeader>
              <SectionTitle subtitle="This week's spending pattern">Weekly Spending</SectionTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={weeklyData} margin={{ left: -10 }}>
                  <defs>
                    <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="amount" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#weeklyGrad)" name="Spending" dot={{ fill: '#0EA5E9', strokeWidth: 0, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row 2 */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Category Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <SectionTitle subtitle="Spending by category this month">Category Breakdown</SectionTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryData.length > 0 ? (
                  categoryData.map(cat => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                          <span className="text-white/70 text-sm">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white/40 text-xs">{cat.percentage}%</span>
                          <span className="text-white/80 text-sm font-semibold w-16 text-right">₹{Math.round(cat.value).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: cat.color }}
                        />
                      </div>
                    </div>
                  ))
                    
                ) : (
                  <p className="text-white/40 text-sm text-center py-4">No expense data yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Budget Performance Radar */}
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Budget utilization %">Budget Health</SectionTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                    <Radar name="Usage" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-white/40 text-sm">No budget data</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Stats */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Quick summary of your finances">Summary</SectionTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-white/40 text-xs mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-white">{transactions.length}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Active Categories</p>
                  <p className="text-2xl font-bold text-white">{new Set(transactions.map(t => t.category)).size}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Active Budgets</p>
                  <p className="text-2xl font-bold text-white">{budgets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  )};
