import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DoorOpen, Mail, Pencil, Ruler, Trash2 } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDeleteUnit, useUnit } from '@/features/units/hooks';
import { useProperty } from '@/features/properties/hooks';
import { UnitCategoryBadge } from '@/features/units/components/UnitCategoryBadge';
import { UnitCategoryEditModal } from '@/features/units/components/UnitCategoryEditModal';
import { UnitDimensions } from '@/features/units/components/UnitDimensions';
import { DimensionsEditModal } from '@/features/units/components/DimensionsEditModal';
import { usePhotosByProperty, usePhotosByUnit, useUploadPhotos } from '@/features/photos/hooks';
import { PhotoGrid } from '@/features/photos/components/PhotoGrid';
import { PhotoUploader } from '@/features/photos/components/PhotoUploader';
import { usePageTitle } from '@/utils/usePageTitle';

export function UnitDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const unit = useUnit(id);
  const propertyId = unit.data?.property_id ?? '';
  const property = useProperty(propertyId);
  const unitPhotos = usePhotosByUnit(id);
  const propertyPhotos = usePhotosByProperty(propertyId);
  const upload = useUploadPhotos();
  const del = useDeleteUnit(propertyId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [catEditOpen, setCatEditOpen] = useState(false);
  const [dimsEditOpen, setDimsEditOpen] = useState(false);

  usePageTitle(
    property.data && unit.data
      ? `${property.data.name} — ${unit.data.name}`
      : unit.data?.name ?? 'Unit',
  );

  const onUpload = async (files: File[]) => {
    try {
      await upload.mutateAsync({
        kind: 'unit',
        unitId: id,
        files,
        baseSort: unitPhotos.data?.length ?? 0,
      });
      toast.success(`Uploaded ${files.length} photo${files.length === 1 ? '' : 's'}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    }
  };

  const handleDelete = async () => {
    try {
      await del.mutateAsync(id);
      toast.success('Unit deleted');
      navigate(propertyId ? `/property/${propertyId}` : '/', { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not delete unit');
    }
  };

  if (unit.isLoading) {
    return (
      <>
        <TopBar showBack />
        <PageContainer>
          <Skeleton className="h-12 w-1/2 mb-3" />
          <Skeleton className="h-32 w-full mb-3" />
          <Skeleton className="h-32 w-full" />
        </PageContainer>
      </>
    );
  }

  if (!unit.data) {
    return (
      <>
        <TopBar showBack />
        <PageContainer>
          <EmptyState
            icon={<DoorOpen size={22} strokeWidth={1.75} />}
            title="Unit not found"
            description="It may have been deleted."
          />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <TopBar
        title={unit.data.name}
        subtitle={property.data?.name}
        showBack
        right={
          <IconButton
            ariaLabel="Delete unit"
            variant="danger"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 size={18} strokeWidth={1.75} />
          </IconButton>
        }
      />

      <PageContainer>
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-[24px] font-semibold leading-tight truncate">
                {unit.data.name}
              </h1>
              <div className="mt-2">
                <UnitCategoryBadge value={unit.data.category} />
              </div>
            </div>
            <IconButton ariaLabel="Edit category" onClick={() => setCatEditOpen(true)}>
              <Pencil size={16} strokeWidth={1.75} />
            </IconButton>
          </div>
          {unit.data.notes ? (
            <p className="mt-3 text-[14px] whitespace-pre-wrap">{unit.data.notes}</p>
          ) : null}
        </Card>

        <section className="mt-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-[15px] font-semibold inline-flex items-center gap-1.5">
              <Ruler size={14} strokeWidth={1.75} />
              Dimensions
            </h3>
            <button
              type="button"
              onClick={() => setDimsEditOpen(true)}
              className="text-[13px] font-semibold text-accent dark:text-accent-dark hover:underline"
            >
              Edit
            </button>
          </div>
          <UnitDimensions unit={unit.data} />
        </section>

        {(propertyPhotos.data?.length ?? 0) > 0 ? (
          <section className="mt-5">
            <div className="flex items-baseline justify-between px-1 mb-2">
              <h3 className="text-[15px] font-semibold">Property Photos</h3>
              {property.data ? (
                <span className="text-[12px] text-muted dark:text-muted-dark truncate">
                  from {property.data.name}
                </span>
              ) : null}
            </div>
            <PhotoGrid photos={propertyPhotos.data ?? []} />
          </section>
        ) : null}

        <section className="mt-5">
          <h3 className="text-[15px] font-semibold mb-2 px-1">Unit Photos</h3>
          <PhotoGrid
            photos={unitPhotos.data ?? []}
            trailing={<PhotoUploader onFiles={onUpload} uploading={upload.isPending} />}
          />
        </section>

        <div className="mt-8 mb-2 flex justify-center">
          <Button
            size="lg"
            leftIcon={<Mail size={18} strokeWidth={1.75} />}
            onClick={() => navigate(`/unit/${id}/select`)}
          >
            Select & Send via Email
          </Button>
        </div>
      </PageContainer>

      <UnitCategoryEditModal
        unitId={id}
        initial={unit.data.category}
        open={catEditOpen}
        onClose={() => setCatEditOpen(false)}
      />
      <DimensionsEditModal
        unit={unit.data}
        open={dimsEditOpen}
        onClose={() => setDimsEditOpen(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete unit?"
        message="This removes the unit and its photos. Property compliance documents and property-level photos stay."
        confirmLabel="Delete"
        destructive
        loading={del.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
