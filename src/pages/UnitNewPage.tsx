import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { UnitForm } from '@/features/units/components/UnitForm';
import { useCreateUnit } from '@/features/units/hooks';
import { usePageTitle } from '@/utils/usePageTitle';
import { AlertTriangle } from 'lucide-react';

export function UnitNewPage() {
  const [params] = useSearchParams();
  const propertyId = params.get('propertyId') ?? '';
  const navigate = useNavigate();
  const create = useCreateUnit();
  usePageTitle('New unit');

  if (!propertyId) {
    return (
      <>
        <TopBar title="New unit" showBack />
        <PageContainer>
          <EmptyState
            icon={<AlertTriangle size={22} strokeWidth={1.75} />}
            title="Missing property"
            description="Open a property first, then add a unit from its detail page."
          />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <TopBar title="New unit" showBack />
      <PageContainer>
        <Card className="p-5">
          <UnitForm
            submitLabel="Create unit"
            loading={create.isPending}
            onCancel={() => navigate(-1)}
            onSubmit={async (values) => {
              try {
                const u = await create.mutateAsync({
                  property_id: propertyId,
                  name: values.name,
                  category: values.category,
                  notes: values.notes,
                  dimensions: values.dimensions,
                });
                toast.success('Unit created');
                navigate(`/unit/${u.id}`, { replace: true });
              } catch (e) {
                toast.error(e instanceof Error ? e.message : 'Could not create unit');
              }
            }}
          />
        </Card>
      </PageContainer>
    </>
  );
}
