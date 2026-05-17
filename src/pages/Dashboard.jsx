import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, PiggyBank, Wallet,
  ArrowUpRight, ArrowDownRight, Sparkles, Calendar, ChevronRight, Plus
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatCard, Card, CardHeader, CardContent, Badge, ProgressBar, SectionTitle } from '../components/ui';
import { PageWrapper, staggerContainer, staggerItem } from '../animations/variants.jsx';
import { BillModal } from '../components/BillModal';

const COLORS = ['#10B981', '#F43F5E', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EC4899', '#14B8A6', '#84CC16'];

const AnimatedCounter = ({ target, prefix = '', suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span>{prefix}{count.toLocaleString()}{suffix}</span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 border border-white/[0.12] shadow-card">
      <p className="text-white/60 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/70 capitalize">{p.dataKey}:</span>
          <span className="text-white font-medium">₹{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-2.5 border border-white/[0.12]">
      <p className="text-white text-xs font-medium">{payload[0].name}</p>
      <p className="text-white/60 text-xs">₹{payload[0].value}</p>
    </div>
  );
};

export const Dashboard = () => {
  const { transactions, totalIncome, totalExpenses, netBalance, savingsRate, budgets, bills } = useFinance();
  const [showBillModal, setShowBillModal] = useState(false);
  const recentTxns = [...transactions].sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date)).slice(0, 5);

  // Get month name
  const getMonthName = (date) => {
    return new Date(date).toLocaleString('default', { month: 'short' });
  };

  // Calculate monthly data for last 7 months
  const calculateMonthlyData = () => {
    const months = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
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

  // Calculate expense categories
  const calculateExpenseCategories = () => {
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
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Calculate dynamic trends
  const calculateTrend = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const monthlyData = calculateMonthlyData();
  const expenseCategories = calculateExpenseCategories();
  
  const currentMonthData = monthlyData[monthlyData.length - 1] || {};
  const previousMonthData = monthlyData[monthlyData.length - 2] || {};
  
  const incomeTrend = calculateTrend(currentMonthData.income || 0, previousMonthData.income || 0);
  const expenseTrend = calculateTrend(currentMonthData.expenses || 0, previousMonthData.expenses || 0);
  
  // Calculate balance trend
  const currentNetBalance = (currentMonthData.income || 0) - (currentMonthData.expenses || 0);
  const previousNetBalance = (previousMonthData.income || 0) - (previousMonthData.expenses || 0);
  const balanceTrend = calculateTrend(currentNetBalance, previousNetBalance);
  
  // Calculate savings rate trend
  const currentSavingsRate = currentMonthData.income ? ((currentNetBalance / currentMonthData.income) * 100) : 0;
  const previousSavingsRate = previousMonthData.income ? ((previousNetBalance / previousMonthData.income) * 100) : 0;
  const savingsRateTrend = calculateTrend(currentSavingsRate, previousSavingsRate);

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">

        {/* Summary Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Balance"
            value={`₹${netBalance.toLocaleString()}`}
            subtitle="Current net balance"
            icon={Wallet}
            color="emerald"
            trend={balanceTrend}
          />
          <StatCard
            title="Monthly Income"
            value={formatCurrency(totalIncome)}
            subtitle="This month"
            icon={TrendingUp}
            color="blue"
            trend={incomeTrend}
          />
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(totalExpenses)}
            subtitle="This month"
            icon={TrendingDown}
            color="rose"
            trend={expenseTrend}
          />
          <StatCard
            title="Profit/Loss"
            value={formatCurrency(totalIncome - totalExpenses)}
            subtitle="Monthly net"
            icon={totalIncome - totalExpenses >= 0 ? TrendingUp : TrendingDown}
            color={totalIncome - totalExpenses >= 0 ? "emerald" : "rose"}
            trend={savingsRateTrend}
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <SectionTitle subtitle="Last 7 months income vs expenses">
                Monthly Overview
              </SectionTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="expenses" stroke="#F43F5E" strokeWidth={2} fill="url(#expenseGrad)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-0.5 bg-emerald-500 rounded" />Income
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <div className="w-3 h-0.5 bg-rose-500 rounded" />Expenses
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <SectionTitle subtitle="May 2026">Expense Breakdown</SectionTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseCategories.map((entry, i) => (
                        <Cell key={i} fill={entry.color} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {expenseCategories.map(cat => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                      <span className="text-white/60">{cat.name}</span>
                    </div>
                    <span className="text-white/80 font-medium">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Row */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <SectionTitle
                subtitle="Latest activity"
                action={
                  <button className="text-emerald-400 text-xs font-medium flex items-center gap-1 hover:text-emerald-300 transition-colors">
                    View all <ChevronRight size={14} />
                  </button>
                }
              >
                Recent Transactions
              </SectionTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/[0.04]">
                {recentTxns.map((txn, i) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-lg flex-shrink-0">
                      {txn.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/85 text-sm font-medium truncate">{txn.title}</p>
                      <p className="text-white/35 text-xs">{txn.category} · {formatDate(txn.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {txn.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(txn.amount))}
                      </p>
                      <p className="text-white/30 text-xs">{txn.method}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Upcoming Bills */}
            <Card>
              <CardHeader>
                <SectionTitle
                  subtitle="Due this month"
                  action={
                    <button 
                      onClick={() => setShowBillModal(true)}
                      className="text-emerald-400 text-xs font-medium flex items-center gap-1 hover:text-emerald-300 transition-colors"
                    >
                      <Plus size={14} /> Add Bill
                    </button>
                  }
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-sky-400" />
                    <span className="text-white font-semibold text-sm">Upcoming Bills</span>
                  </div>
                </SectionTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {bills && bills.length > 0 ? (
                  [...bills]
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 4)
                    .map(bill => (
                      <div key={bill.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{bill.icon || '📌'}</span>
                          <div>
                            <p className="text-white/80 text-xs font-medium">{bill.title}</p>
                            <p className="text-white/35 text-[10px]">{formatDate(bill.dueDate)}</p>
                          </div>
                        </div>
                        <span className="text-white/70 text-xs font-semibold">{formatCurrency(bill.amount)}</span>
                      </div>
                    ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-white/40 text-xs">No bills added yet</p>
                    <button
                      onClick={() => setShowBillModal(true)}
                      className="text-emerald-400 text-xs mt-2 hover:text-emerald-300"
                    >
                      Add your first bill
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Budget Progress */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Current month budget utilization">Budget Overview</SectionTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map(budget => {
                  const pct = Math.round((budget.spent / budget.limit) * 100);
                  const isOver = budget.spent > budget.limit;
                  return (
                    <div key={budget.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span>{budget.icon}</span>
                          <span className="text-white/75 text-sm font-medium">{budget.category}</span>
                        </div>
                        <Badge variant={isOver ? 'rose' : 'default'}>{pct}%</Badge>
                      </div>
                      <ProgressBar value={budget.spent} max={budget.limit} color={budget.color} />
                      <div className="flex justify-between mt-2 text-xs text-white/40">
                        <span>{formatCurrency(budget.spent)}</span>
                        <span>{formatCurrency(budget.limit)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>

      <BillModal isOpen={showBillModal} onClose={() => setShowBillModal(false)} />
    </PageWrapper>
  );
};


