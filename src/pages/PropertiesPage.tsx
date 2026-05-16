import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Search, X } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useProperties } from '@/features/properties/hooks';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { FAB } from '@/components/ui/FAB';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/utils/usePageTitle';
import { useDebouncedValue } from '@/utils/useDebouncedValue';

export function PropertiesPage() {
  const properties = useProperties();
  const navigate = useNavigate();
  usePageTitle('Properties');

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 250);

  const filtered = useMemo(() => {
    const all = properties.data ?? [];
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) => {
      const haystack = `${p.name} ${p.address ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [properties.data, debouncedQuery]);

  const filtering = debouncedQuery.trim().length > 0;
  const totalCount = properties.data?.length ?? 0;
  const totalLabel = filtering
    ? `${filtered.length} ${filtered.length === 1 ? 'match' : 'matches'}`
    : `${totalCount} total`;

  return (
    <>
      <TopBar />
      <PageContainer>
        <div className="mb-4 px-1">
          <div className="flex items-baseline justify-between">
            <h1 className="text-[28px] font-semibold">Properties</h1>
            <span className="text-[13px] text-muted dark:text-muted-dark">
              {totalLabel}
            </span>
          </div>
          <p className="text-[13px] text-muted dark:text-muted-dark mt-0.5">
            Tap a property to manage its units and photos.
          </p>
        </div>

        <div className="mb-5">
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.75}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, street, or postcode"
              autoComplete="off"
              spellCheck={false}
              className="h-11 w-full rounded-button border border-border bg-surface pl-9 pr-9 text-[15px] text-text outline-none transition-colors placeholder:text-muted/60 focus:border-accent dark:border-border-dark dark:bg-surface-dark dark:text-text-dark dark:placeholder:text-muted-dark/60 dark:focus:border-accent-dark"
            />
            {query.length > 0 ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-pill text-muted hover:bg-border/40 dark:text-muted-dark dark:hover:bg-border-dark/40"
              >
                <X size={14} strokeWidth={1.75} />
              </button>
            ) : null}
          </div>
        </div>

        {properties.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-card overflow-hidden border border-border dark:border-border-dark">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="p-3.5 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : totalCount === 0 ? (
          <EmptyState
            icon={<Home size={22} strokeWidth={1.75} />}
            title="No properties yet"
            description="Add your first property to start tracking units, photos, and compliance documents."
            action={
              <Button
                onClick={() => navigate('/property/new')}
                leftIcon={<Plus size={16} strokeWidth={1.75} />}
              >
                Add property
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={22} strokeWidth={1.75} />}
            title="No matches"
            description="Try a different name, street, or postcode."
            action={
              <Button variant="secondary" onClick={() => setQuery('')}>
                Clear search
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </PageContainer>

      <FAB
        ariaLabel="Add property"
        label="New"
        icon={<Plus size={20} strokeWidth={1.75} />}
        onClick={() => navigate('/property/new')}
      />
    </>
  );
}
