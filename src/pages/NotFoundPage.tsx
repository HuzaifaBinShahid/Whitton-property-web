import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/utils/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Not found');
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg dark:bg-bg-dark">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-pill bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
          <Compass size={22} strokeWidth={1.75} />
        </div>
        <h1 className="text-[24px] font-semibold mb-1">Page not found</h1>
        <p className="text-[14px] text-muted dark:text-muted-dark mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>Back to properties</Button>
        </Link>
      </div>
    </div>
  );
}
