import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email/username and password');
      return;
    }

    setLoading(true);

    // Save remember me preference before authenticating
    localStorage.setItem('whitton_remember_me', rememberMe ? 'true' : 'false');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || 'Invalid username or password');
    } else {
      toast.success('Access Granted! Welcome back.');
      navigate(from, { replace: true });
    }
  };

  const handleAutofillAdmin = () => {
    setEmail('admin@gmail.com');
    setPassword('@Adm1n@');
    toast.success('Admin credentials loaded');
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Whitton Property Web
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Protected Access • Enter username & password to enter
            </p>
          </div>

          {/* Quick-fill Helper Chip */}
          <div className="mb-6 p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
              <KeyRound className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Admin Account Ready</span>
            </div>
            <button
              type="button"
              onClick={handleAutofillAdmin}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Autofill Credentials
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-border-dark rounded-xl bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="admin@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 dark:border-border-dark rounded-xl bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold tracking-wide"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Access Website'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

