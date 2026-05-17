import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, CreditCard, Globe, ChevronRight, Sun, Moon, Check } from 'lucide-react';
import { Card, CardHeader, CardContent, SectionTitle } from '../components/ui';
import { PageWrapper, staggerContainer, staggerItem } from '../animations/variants.jsx';
import { useFinance } from '../context/FinanceContext';
import { toast } from 'sonner';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all ${checked ? 'bg-emerald-500' : 'bg-white/15'}`}
  >
    <motion.div
      animate={{ x: checked ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
    />
  </button>
);

const SettingRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/[0.05]">
        <Icon size={16} className="text-white/50" />
      </div>
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        {description && <p className="text-white/35 text-xs">{description}</p>}
      </div>
    </div>
    {children}
  </div>
);

export const Settings = () => {
  const { user } = useFinance();
  const [notifications, setNotifications] = useState({ email: true, push: true, budgetAlert: true, weeklyReport: false, aiInsights: true });
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState('dark');
  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email });

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5 max-w-2xl">
        {/* Profile */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Manage your personal information">Profile Settings</SectionTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-white/40 text-sm">{user.email}</p>
                  <button className="text-emerald-400 text-xs font-medium mt-1 hover:text-emerald-300 transition-colors">
                    Change avatar →
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    className="input-glass"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                    className="input-glass"
                  />
                </div>
                <button
                  onClick={() => toast.success('Profile updated!')}
                  className="btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Control how you receive alerts">Notifications</SectionTitle>
            </CardHeader>
            <CardContent>
              {[
                { key: 'email', icon: Bell, title: 'Email Notifications', desc: 'Receive reports via email' },
                { key: 'push', icon: Bell, title: 'Push Notifications', desc: 'Browser push alerts' },
                { key: 'budgetAlert', icon: Shield, title: 'Budget Alerts', desc: 'Notify when budget is exceeded' },
                { key: 'weeklyReport', icon: Globe, title: 'Weekly Report', desc: 'Get your weekly financial summary' },
                { key: 'aiInsights', icon: User, title: 'AI Insights', desc: 'Receive personalized AI suggestions' },
              ].map(({ key, icon, title, desc }) => (
                <SettingRow key={key} icon={icon} title={title} description={desc}>
                  <Toggle
                    checked={notifications[key]}
                    onChange={v => setNotifications(n => ({ ...n, [key]: v }))}
                  />
                </SettingRow>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Customize your experience">Preferences</SectionTitle>
            </CardHeader>
            <CardContent>
              {/* Currency */}
              <SettingRow icon={CreditCard} title="Default Currency" description="Currency for all transactions">
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="input-glass w-24"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {currencies.map(c => (
                    <option key={c} value={c} style={{ background: '#0D1120' }}>{c}</option>
                  ))}
                </select>
              </SettingRow>

              {/* Theme */}
              <SettingRow icon={Palette} title="Theme" description="Choose your preferred theme">
                <div className="flex bg-white/[0.06] rounded-xl p-1 gap-1">
                  {[['dark', Moon], ['light', Sun]].map(([t, Icon]) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        theme === t ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      <Icon size={13} /> {t}
                    </button>
                  ))}
                </div>
              </SettingRow>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <SectionTitle subtitle="Protect your account">Security</SectionTitle>
            </CardHeader>
            <CardContent>
              {[
                { title: 'Change Password', desc: 'Last changed 3 months ago' },
                { title: 'Two-Factor Authentication', desc: '2FA is disabled' },
                { title: 'Connected Accounts', desc: '0 accounts linked' },
              ].map(item => (
                <button key={item.title} className="w-full flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] -mx-5 px-5 transition-all group">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{item.title}</p>
                    <p className="text-white/35 text-xs">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={staggerItem}>
          <Card className="border-rose-500/20">
            <CardHeader>
              <SectionTitle subtitle="Irreversible actions">Danger Zone</SectionTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Delete Account</p>
                  <p className="text-white/35 text-xs">Permanently remove your account and data</p>
                </div>
                <button
                  onClick={() => toast.error('Action requires email confirmation')}
                  className="px-4 py-2 text-sm font-medium text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/10 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};
