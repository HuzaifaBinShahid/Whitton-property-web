import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to manage your properties
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-border-dark rounded-xl bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-border-dark rounded-xl bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-2.5"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
