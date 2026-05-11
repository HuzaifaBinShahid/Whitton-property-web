import { AnimatePresence, motion } from 'framer-motion';
import { Mail, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion as tokens } from '@/theme/tokens';

type Props = {
  count: number;
  onCompose: () => void;
  onMove?: () => void;
  pending?: boolean;
};

export function ComposeEmailBar({ count, onCompose, onMove, pending }: Props) {
  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={tokens.spring}
          className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:left-auto z-30"
        >
          <div className="mx-auto sm:mx-0 max-w-md sm:max-w-none flex items-center gap-2 rounded-card bg-surface border border-border shadow-xl shadow-black/15 p-2 dark:bg-surface-dark dark:border-border-dark">
            <div className="px-2.5 text-[13px] font-semibold whitespace-nowrap">
              {count} selected
            </div>
            <div className="ml-auto flex items-center gap-2">
              {onMove ? (
                <Button variant="secondary" onClick={onMove} leftIcon={<ArrowRightLeft size={16} strokeWidth={1.75} />}>
                  Move
                </Button>
              ) : null}
              <Button
                onClick={onCompose}
                loading={pending}
                leftIcon={<Mail size={16} strokeWidth={1.75} />}
              >
                Compose Email
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
