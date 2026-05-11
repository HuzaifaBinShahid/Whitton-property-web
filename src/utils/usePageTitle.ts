import { useEffect } from 'react';

const SUFFIX = 'Property Manager';

export function usePageTitle(title: string | undefined): void {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX;
    return () => {
      document.title = SUFFIX;
    };
  }, [title]);
}
