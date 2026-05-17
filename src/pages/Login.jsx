import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '../services/authService';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        await signIn(form.email, form.password);
      } else {
        // Sign up
        await signUp(form.email, form.password, { name: form.name });
      }
      // Navigate to dashboard on success
      navigate('/');
    } catch (err) {
      // Handle Firebase error messages
      let errorMessage = err.message;
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Email not found. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      let errorMessage = err.message;
      if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in cancelled.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'Email already exists with a different provider.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-glow">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">FinAI</span>
            <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">PRO</span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Your finances,<br />
            <span className="gradient-text">reimagined.</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            AI-powered personal finance tracking. Track expenses, set budgets, and achieve your financial goals with intelligent insights.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: '📊', title: 'Smart Analytics', desc: 'AI-driven spending insights' },
            { icon: '🤖', title: 'AI Assistant', desc: 'Personalized financial advice' },
            { icon: '🎯', title: 'Goal Tracking', desc: 'Stay on top of your savings goals' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/[0.08]"
            >
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{f.title}</p>
                <p className="text-white/40 text-xs">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1120] to-[#0B0F19]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-white font-bold">FinAI</span>
          </div>

          <div className="glass-card p-8 border border-white/[0.1]">
            {/* Toggle */}
            <div className="flex bg-white/[0.05] rounded-xl p-1 mb-6 gap-1">
              {['Sign In', 'Create Account'].map((label, i) => (
                <button
                  key={i}
                  onClick={() => setIsLogin(i === 0)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isLogin === (i === 0) ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <h2 className="text-white font-bold text-2xl mb-1">
              {isLogin ? 'Welcome back 👋' : 'Get started free'}
            </h2>
            <p className="text-white/40 text-sm mb-6">
              {isLogin ? 'Sign in to your FinAI account' : 'Create your account in seconds'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2"
                >
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-xs">{error}</p>
                </motion.div>
              )}
              
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-white/50 text-xs font-medium mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Alex Johnson"
                      className="input-glass"
                      required={!isLogin}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="input-glass"
                  required
                />
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="input-glass pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {isLogin && (
                  <button type="button" className="text-emerald-400 text-xs font-medium mt-1.5 hover:text-emerald-300 transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                    />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400 flex-shrink-0" />
              <p className="text-white/50 text-xs">
                {isLogin ? 'No account yet? Switch to "Create Account"' : 'Already have an account? Switch to "Sign In"'}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-white/25 text-xs">or continue with</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-3">
              {['Google', 'GitHub'].map(provider => (
                <button
                  key={provider}
                  type="button"
                  disabled={loading}
                  onClick={provider === 'Google' ? handleGoogleSignIn : undefined}
                  className="btn-ghost justify-center text-xs py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {provider === 'Google' ? '🔵' : '⚫'} {provider}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
