import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SentEmail } from '@/types/db';
import { formatRelative } from '@/utils/dates';

type Props = {
  email: SentEmail;
  index: number;
};

export function SentEmailRow({ email, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index, 10) * 0.02 }}
      className="flex items-center gap-3 px-3.5 py-3 border-b border-border last:border-b-0 dark:border-border-dark"
    >
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
        <Mail size={16} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold truncate">
          {email.subject || 'Untitled email'}
        </div>
        <div className="text-[12px] text-muted dark:text-muted-dark">
          {email.photo_count} {email.photo_count === 1 ? 'attachment' : 'attachments'}
        </div>
      </div>
      <div className="text-[12px] text-muted dark:text-muted-dark whitespace-nowrap">
        {formatRelative(email.sent_at)}
      </div>
    </motion.div>
  );
}
