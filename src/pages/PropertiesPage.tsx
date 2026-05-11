import { useNavigate } from 'react-router-dom';
import { Home, Plus } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { useProperties } from '@/features/properties/hooks';
import { PropertyCard } from '@/features/properties/components/PropertyCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { FAB } from '@/components/ui/FAB';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/utils/usePageTitle';

export function PropertiesPage() {
  const properties = useProperties();
  const navigate = useNavigate();
  usePageTitle('Properties');

  return (
    <>
      <TopBar />
      <PageContainer>
        <div className="flex items-baseline justify-between mb-5 px-1">
          <h1 className="text-[28px] font-semibold">Properties</h1>
          <span className="text-[13px] text-muted dark:text-muted-dark">
            {properties.data?.length ?? 0} total
          </span>
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
        ) : properties.data && properties.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {properties.data.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        ) : (
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
