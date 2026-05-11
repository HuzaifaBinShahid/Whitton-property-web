import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col items-center text-center py-12 px-6 rounded-card border border-dashed border-border dark:border-border-dark"
    >
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-pill bg-accent/10 text-accent dark:bg-accent-dark/10 dark:text-accent-dark">
        {icon}
      </div>
      <h3 className="text-[16px] font-semibold mb-1">{title}</h3>
      {description ? (
        <p className="text-[14px] text-muted dark:text-muted-dark max-w-xs">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </motion.div>
  );
}
