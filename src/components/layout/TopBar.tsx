import type { ReactNode } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ChevronLeft, Home, BarChart3 } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { cn } from '@/utils/cn';

type Props = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
};

export function TopBar({ title, subtitle, showBack, right }: Props) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-bg/80 dark:bg-bg-dark/80 border-b border-border/60 dark:border-border-dark/60">
      <div className="max-w-5xl mx-auto h-14 px-3 sm:px-5 flex items-center gap-2">
        {showBack ? (
          <IconButton ariaLabel="Back" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} strokeWidth={1.75} />
          </IconButton>
        ) : (
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 px-2.5 h-9 rounded-button text-[13px] font-semibold transition-colors',
                  isActive
                    ? 'bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
                    : 'text-muted hover:text-text dark:text-muted-dark dark:hover:text-text-dark',
                )
              }
            >
              <Home size={16} strokeWidth={1.75} />
              Properties
            </NavLink>
            <NavLink
              to="/stats"
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 px-2.5 h-9 rounded-button text-[13px] font-semibold transition-colors',
                  isActive
                    ? 'bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark'
                    : 'text-muted hover:text-text dark:text-muted-dark dark:hover:text-text-dark',
                )
              }
            >
              <BarChart3 size={16} strokeWidth={1.75} />
              Stats
            </NavLink>
          </nav>
        )}

        <div className="flex-1 min-w-0 px-1">
          {title ? (
            <div className="truncate">
              <div className="text-[15px] font-semibold leading-tight truncate">{title}</div>
              {subtitle ? (
                <div className="text-[12px] text-muted dark:text-muted-dark truncate">
                  {subtitle}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {right ? <div className="flex items-center gap-1">{right}</div> : null}
      </div>
    </header>
  );
}
