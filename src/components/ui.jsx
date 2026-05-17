import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald', trend, className }) => {
  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
    blue: { bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400', icon: 'text-sky-400' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', icon: 'text-violet-400' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', icon: 'text-rose-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: 'text-amber-400' },
  };

  const colors = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn('glass-card p-5 relative overflow-hidden group', className)}
    >
      {/* Glow effect */}
      <div className={cn('absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity', colors.bg)} />

      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl', colors.bg, 'border', colors.border)}>
          <Icon size={20} className={colors.icon} />
        </div>
        {trend !== undefined && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <div>
        <p className="text-white/50 text-xs font-medium mb-1">{title}</p>
        <p className="text-white text-2xl font-bold tracking-tight mb-1">{value}</p>
        {subtitle && <p className="text-white/35 text-xs">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export const Card = ({ children, className, ...props }) => (
  <div className={cn('glass-card', className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn('p-5 border-b border-white/[0.06]', className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={cn('p-5', className)}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    income: 'badge-income',
    expense: 'badge-expense',
    default: 'bg-white/10 text-white/70 border border-white/15',
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    violet: 'bg-violet-500/15 text-violet-400 border border-violet-500/25',
    sky: 'bg-sky-500/15 text-sky-400 border border-sky-500/25',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    rose: 'bg-rose-500/15 text-rose-400 border border-rose-500/25',
  };

  return (
    <span className={cn('badge', variants[variant] || variants.default, className)}>
      {children}
    </span>
  );
};

export const ProgressBar = ({ value, max, color = '#10B981', className }) => {
  const pct = Math.min((value / max) * 100, 100);
  const isOver = value > max;

  return (
    <div className={cn('progress-bar', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="progress-fill"
        style={{ background: isOver ? '#F43F5E' : `linear-gradient(90deg, ${color}, ${color}cc)` }}
      />
    </div>
  );
};

export const SkeletonLoader = ({ className }) => (
  <div className={cn('shimmer rounded-xl', className)} />
);

export const SectionTitle = ({ children, subtitle, action }) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h2 className="text-white font-semibold text-base">{children}</h2>
      {subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);
