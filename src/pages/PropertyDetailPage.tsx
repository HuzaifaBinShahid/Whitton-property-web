import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DoorOpen, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Card } from '@/components/ui/Card';
import { FAB } from '@/components/ui/FAB';
import { useDeleteProperty, useProperty } from '@/features/properties/hooks';
import { PropertyHero } from '@/features/properties/components/PropertyHero';
import { UtilitiesSection } from '@/features/properties/components/UtilitiesSection';
import { useUnitsByProperty } from '@/features/units/hooks';
import { UnitCard } from '@/features/units/components/UnitCard';
import { usePhotosByProperty, useUploadPhotos } from '@/features/photos/hooks';
import { PhotoGrid } from '@/features/photos/components/PhotoGrid';
import { PhotoUploader } from '@/features/photos/components/PhotoUploader';
import { useComplianceDocs } from '@/features/compliance/hooks';
import { ComplianceCategorySection } from '@/features/compliance/components/ComplianceCategorySection';
import { COMPLIANCE_CATEGORIES } from '@/features/compliance/categories';
import { usePageTitle } from '@/utils/usePageTitle';

export function PropertyDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = useProperty(id);
  const units = useUnitsByProperty(id);
  const photos = usePhotosByProperty(id);
  const compliance = useComplianceDocs(id);
  const upload = useUploadPhotos();
  const del = useDeleteProperty();
  const [confirmOpen, setConfirmOpen] = useState(false);

  usePageTitle(property.data?.name ?? 'Property');

  const onUpload = async (files: File[]) => {
    try {
      await upload.mutateAsync({
        kind: 'property',
        propertyId: id,
        files,
        baseSort: (photos.data?.length ?? 0),
      });
      toast.success(`Uploaded ${files.length} photo${files.length === 1 ? '' : 's'}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const handleDelete = async () => {
    try {
      await del.mutateAsync(id);
      toast.success('Property deleted');
      navigate('/', { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not delete property');
    }
  };

  if (property.isLoading) {
    return (
      <>
        <TopBar showBack />
        <PageContainer>
          <Skeleton className="h-56 w-full mb-5" />
          <Skeleton className="h-32 w-full mb-3" />
          <Skeleton className="h-32 w-full" />
        </PageContainer>
      </>
    );
  }

  if (!property.data) {
    return (
      <>
        <TopBar showBack />
        <PageContainer>
          <EmptyState
            icon={<DoorOpen size={22} strokeWidth={1.75} />}
            title="Property not found"
            description="It may have been deleted on another device."
          />
        </PageContainer>
      </>
    );
  }

  const docsByCategory = COMPLIANCE_CATEGORIES.map((c) => ({
    category: c.value,
    docs: (compliance.data ?? []).filter((d) => d.category === c.value),
  }));

  return (
    <>
      <TopBar
        title={property.data.name}
        showBack
        right={
          <IconButton
            ariaLabel="Delete property"
            variant="danger"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 size={18} strokeWidth={1.75} />
          </IconButton>
        }
      />

      <PageContainer>
        <PropertyHero property={property.data} />

        {property.data.notes ? (
          <Card className="p-4 mt-4">
            <div className="text-[12px] uppercase tracking-wider font-semibold text-muted dark:text-muted-dark mb-1">
              Notes
            </div>
            <p className="text-[14px] whitespace-pre-wrap">{property.data.notes}</p>
          </Card>
        ) : null}

        <section className="mt-6">
          <h3 className="text-[15px] font-semibold mb-2 px-1">Property Photos</h3>
          <PhotoGrid
            photos={photos.data ?? []}
            trailing={<PhotoUploader onFiles={onUpload} uploading={upload.isPending} />}
          />
          <p className="text-[12px] text-muted dark:text-muted-dark mt-2 px-1">
            Property photos appear on every unit too.
          </p>
        </section>

        <section className="mt-6">
          <UtilitiesSection property={property.data} />
        </section>

        <section className="mt-6">
          <h3 className="text-[15px] font-semibold mb-2 px-1">Compliance Documents</h3>
          {compliance.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {docsByCategory.map(({ category, docs }) => (
                <ComplianceCategorySection
                  key={category}
                  propertyId={id}
                  category={category}
                  docs={docs}
                />
              ))}
            </div>
          )}
          {!compliance.isLoading && (compliance.data?.length ?? 0) === 0 ? (
            <div className="mt-2 px-1 text-[12px] text-muted dark:text-muted-dark">
              <ShieldCheck size={12} strokeWidth={1.75} className="inline -mt-0.5 mr-1" />
              Expand any category and upload your first document.
            </div>
          ) : null}
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-[15px] font-semibold">Units</h3>
            <span className="text-[12px] text-muted dark:text-muted-dark">
              {units.data?.length ?? 0} total
            </span>
          </div>
          {units.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : units.data && units.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {units.data.map((u, i) => (
                <UnitCard key={u.id} unit={u} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<DoorOpen size={22} strokeWidth={1.75} />}
              title="No units yet"
              description="Add a unit to start grouping photos and listings."
              action={
                <Button
                  leftIcon={<Plus size={16} strokeWidth={1.75} />}
                  onClick={() => navigate(`/unit/new?propertyId=${id}`)}
                >
                  Add unit
                </Button>
              }
            />
          )}
        </section>
      </PageContainer>

      <FAB
        ariaLabel="Add unit"
        label="Add unit"
        icon={<Plus size={20} strokeWidth={1.75} />}
        onClick={() => navigate(`/unit/new?propertyId=${id}`)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete property?"
        message="This removes the property, all its units, all photos, and all compliance documents. This cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
