import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';

const pageNames = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/analytics': 'Analytics',
  '/budgets': 'Budgets',
  '/goals': 'Goals',
  '/reports': 'Reports',
  '/ai-assistant': 'AI Assistant',
  '/settings': 'Settings',
};

export const TopNav = ({ onMobileMenuOpen }) => {
  const location = useLocation();
  const { user } = useFinance();
  const [showNotifs, setShowNotifs] = useState(false);
  const pageName = pageNames[location.pathname] || 'Dashboard';

  const notifications = [
    { id: 1, title: 'Budget Alert', message: 'Entertainment budget exceeded!', time: '2m ago', type: 'warning' },
    { id: 2, title: 'Goal Milestone', message: 'Emergency fund is 68% complete!', time: '1h ago', type: 'success' },
    { id: 3, title: 'Bill Due Soon', message: 'Car insurance due in 4 days', time: '3h ago', type: 'info' },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.06] bg-white/[0.01] backdrop-blur-sm flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] text-white/60 hover:text-white transition-all"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-white font-semibold text-lg leading-none">{pageName}</h1>
          <p className="text-white/40 text-xs mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white/40 text-sm hover:border-white/[0.14] transition-all cursor-pointer">
          <Search size={14} />
          <span>Search...</span>
          <span className="ml-4 text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">⌘K</span>
        </div>

        {/* AI Badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full">
          <Sparkles size={12} className="animate-pulse" />
          AI Active
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-xl hover:bg-white/[0.06] text-white/60 hover:text-white transition-all"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#0B0F19]" />
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 glass-card shadow-card border border-white/[0.1] z-50"
              >
                <div className="p-4 border-b border-white/[0.06]">
                  <p className="text-white font-semibold text-sm">Notifications</p>
                  <p className="text-white/40 text-xs">{notifications.length} unread</p>
                </div>
                <div className="p-2 space-y-1">
                  {notifications.map(n => (
                    <div key={n.id} className="flex gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === 'warning' ? 'bg-amber-400' :
                        n.type === 'success' ? 'bg-emerald-400' : 'bg-sky-400'
                      }`} />
                      <div>
                        <p className="text-white/80 text-sm font-medium">{n.title}</p>
                        <p className="text-white/40 text-xs">{n.message}</p>
                        <p className="text-white/25 text-xs mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer ring-2 ring-white/[0.1] hover:ring-violet-500/50 transition-all">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
};
