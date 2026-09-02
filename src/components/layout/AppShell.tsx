import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AppShell() {
  const location = useLocation();
  const signOut = useAuth((s) => s.signOut);

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark relative">
      <div className="absolute top-4 right-4 z-50">
        <Button variant="ghost" size="md" onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
