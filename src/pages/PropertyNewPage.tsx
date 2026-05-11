import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { PropertyForm } from '@/features/properties/components/PropertyForm';
import { useCreateProperty } from '@/features/properties/hooks';
import { usePageTitle } from '@/utils/usePageTitle';

export function PropertyNewPage() {
  const navigate = useNavigate();
  const create = useCreateProperty();
  usePageTitle('New property');

  return (
    <>
      <TopBar title="New property" showBack />
      <PageContainer>
        <Card className="p-5">
          <PropertyForm
            submitLabel="Create property"
            loading={create.isPending}
            onCancel={() => navigate(-1)}
            onSubmit={async (values) => {
              try {
                const p = await create.mutateAsync(values);
                toast.success('Property created');
                navigate(`/property/${p.id}`, { replace: true });
              } catch (e) {
                toast.error(e instanceof Error ? e.message : 'Could not create property');
              }
            }}
          />
        </Card>
      </PageContainer>
    </>
  );
}
