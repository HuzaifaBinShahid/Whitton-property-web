import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { motion as tokens } from '@/theme/tokens';
import { cn } from '@/utils/cn';

type Props = {
  icon: ReactNode;
  onClick: () => void;
  ariaLabel: string;
  label?: string;
  className?: string;
};

export function FAB({ icon, onClick, ariaLabel, label, className }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={tokens.spring}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.04 }}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-fab bg-accent px-5 h-14 text-white shadow-lg shadow-accent/30 dark:bg-accent-dark dark:text-bg-dark dark:shadow-accent-dark/30',
        className,
      )}
    >
      {icon}
      {label ? <span className="font-semibold text-[15px] pr-1">{label}</span> : null}
    </motion.button>
  );
}
