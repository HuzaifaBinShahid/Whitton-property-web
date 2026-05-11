import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

export function AppShell() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark">
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
