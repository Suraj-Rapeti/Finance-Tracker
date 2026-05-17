import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, BarChart2, PiggyBank,
  Target, FileText, Bot, Settings, ChevronLeft, ChevronRight,
  Sparkles, TrendingUp, DollarSign, X, LogOut
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { logOut } from '../services/authService';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/analytics', icon: BarChart2, label: 'Analytics' },
  { path: '/budgets', icon: PiggyBank, label: 'Budgets' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { sidebarOpen, setSidebarOpen, user } = useFinance();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-glow">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">FinAI</span>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">PRO</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button - hidden on mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white/80 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 sidebar-scroll overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.path === '/ai-assistant' && sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-auto"
                >
                  <Sparkles size={12} className="text-violet-400 animate-pulse" />
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="px-2 py-4 border-t border-white/[0.06] space-y-2">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer ${!sidebarOpen ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden"
              >
                <p className="text-white/80 text-sm font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-white/35 text-xs truncate">{user?.email || 'user@example.com'}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <LogOut size={18} />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden text-sm"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col h-full bg-white/[0.02] border-r border-white/[0.06] flex-shrink-0 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-[#0D1120] border-r border-white/[0.06] z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
