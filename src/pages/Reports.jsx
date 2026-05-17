import { motion } from 'framer-motion';
import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Card, CardHeader, CardContent, Badge, SectionTitle } from '../components/ui';
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
          <span className="text-white font-medium">₹{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export const Reports = () => {
  const { transactions } = useFinance();

  // Get month name
  const getMonthName = (date) => {
    return new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Calculate monthly reports for all months
  const calculateMonthlyReports = () => {
    const months = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date || t.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[key]) {
        months[key] = {
          month: getMonthName(date),
          income: 0,
          expenses: 0,
          savings: 0,
          savingsRate: 0
        };
      }

      if (t.type === 'income') {
        months[key].income += t.amount;
      } else {
        months[key].expenses += Math.abs(t.amount);
      }
    });

    // Calculate savings and savings rate
    Object.keys(months).forEach(key => {
      const m = months[key];
      m.savings = m.income - m.expenses;
      m.savingsRate = m.income > 0 ? Math.round((m.savings / m.income) * 100) : 0;
    });

    return Object.values(months).sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  // Calculate monthly data for charts
  const calculateMonthlyChartData = () => {
    const months = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('default', { month: 'short' });
      months[key] = { month: monthName, income: 0, expenses: 0, savings: 0 };
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

  const monthlyReports = calculateMonthlyReports();
  const monthlyChartData = calculateMonthlyChartData();

  const currentMonth = monthlyReports[monthlyReports.length - 1] || { income: 0, expenses: 0, savings: 0, savingsRate: 0, month: 'N/A' };
  const prevMonth = monthlyReports[monthlyReports.length - 2] || { income: 0, expenses: 0, savings: 0, savingsRate: 0 };

  const incomeChange = prevMonth.income > 0 ? (((currentMonth.income - prevMonth.income) / prevMonth.income) * 100).toFixed(1) : 0;
  const expenseChange = prevMonth.expenses > 0 ? (((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100).toFixed(1) : 0;
  const savingsChange = prevMonth.savings !== 0 ? (((currentMonth.savings - prevMonth.savings) / Math.abs(prevMonth.savings)) * 100).toFixed(1) : 0;

  const ChangeIndicator = ({ value }) => {
    const v = parseFloat(value);
    if (v > 0) return <span className="text-emerald-400 text-xs flex items-center gap-0.5"><TrendingUp size={12} />+{value}%</span>;
    if (v < 0) return <span className="text-rose-400 text-xs flex items-center gap-0.5"><TrendingDown size={12} />{value}%</span>;
    return <span className="text-white/40 text-xs flex items-center gap-0.5"><Minus size={12} />0%</span>;
  };

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
        {/* Header */}
        <motion.div variants={staggerItem} className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl">Financial Reports</h2>
            <p className="text-white/40 text-sm">Monthly performance overview</p>
          </div>
          <button className="btn-primary">
            <Download size={16} /> Download PDF
          </button>
        </motion.div>

        {/* Current Month Summary */}
        <motion.div variants={staggerItem} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <h3 className="text-white/60 text-sm font-medium mb-4">{currentMonth.month}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-white/40 text-xs mb-1">Income</p>
              <p className="text-white text-2xl font-bold">₹{currentMonth.income.toLocaleString()}</p>
              <ChangeIndicator value={incomeChange} />
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Expenses</p>
              <p className="text-rose-400 text-2xl font-bold">₹{currentMonth.expenses.toLocaleString()}</p>
              <ChangeIndicator value={expenseChange} />
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Net Savings</p>
              <p className="text-emerald-400 text-2xl font-bold">₹{currentMonth.savings.toLocaleString()}</p>
              <ChangeIndicator value={savingsChange} />
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Savings Rate</p>
              <p className="text-violet-400 text-2xl font-bold">{currentMonth.savingsRate}%</p>
              <span className="text-white/35 text-xs">of income</span>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Monthly savings trend">Savings Trend</SectionTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyChartData} margin={{ left: -10 }}>
                  <defs>
                    <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="savings" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#savingsGrad)" name="Savings" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle subtitle="Income vs expense ratio">Financial Health</SectionTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChartData} margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.9} />
                  <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} opacity={0.9} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly History Table */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Performance across months">Monthly History</SectionTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Month', 'Income', 'Expenses', 'Savings', 'Savings Rate', 'Status'].map(h => (
                      <th key={h} className="text-left text-white/35 text-xs font-medium px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthlyReports.map((r, i) => {
                    const isGood = r.savingsRate >= 30;
                    return (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all"
                      >
                        <td className="px-5 py-3.5 text-white/80 text-sm font-medium">{r.month}</td>
                        <td className="px-5 py-3.5 text-emerald-400 text-sm font-semibold">₹{r.income.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-rose-400 text-sm font-semibold">₹{r.expenses.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-violet-400 text-sm font-semibold">₹{r.savings.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-white/70 text-sm">{r.savingsRate}%</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={isGood ? 'emerald' : 'amber'}>
                            {isGood ? 'Excellent' : 'Good'}
                          </Badge>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};
