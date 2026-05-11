import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Images } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useUnit } from '@/features/units/hooks';
import { useProperty } from '@/features/properties/hooks';
import {
  useMovePhotos,
  usePhotoSelection,
  usePhotosByProperty,
  usePhotosByUnit,
} from '@/features/photos/hooks';
import { useComplianceDocs } from '@/features/compliance/hooks';
import { PhotoGrid } from '@/features/photos/components/PhotoGrid';
import { MoveToUnitSheet } from '@/features/photos/components/MoveToUnitSheet';
import { SelectableDocRow } from '@/features/compliance/components/SelectableDocRow';
import { COMPLIANCE_CATEGORIES } from '@/features/compliance/categories';
import { ComposeEmailBar } from '@/features/email/components/ComposeEmailBar';
import { useComposeEmail } from '@/features/email/hooks';
import { usePageTitle } from '@/utils/usePageTitle';
import type { ComplianceDocument, Photo, Unit } from '@/types/db';

export function UnitSelectPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const unit = useUnit(id);
  const propertyId = unit.data?.property_id ?? '';
  const property = useProperty(propertyId);
  const unitPhotos = usePhotosByUnit(id);
  const propertyPhotos = usePhotosByProperty(propertyId);
  const compliance = useComplianceDocs(propertyId);

  const ids = usePhotoSelection((s) => s.ids);
  const docIds = usePhotoSelection((s) => s.docIds);
  const toggle = usePhotoSelection((s) => s.toggle);
  const toggleDoc = usePhotoSelection((s) => s.toggleDoc);
  const clear = usePhotoSelection((s) => s.clear);

  const { compose, pending } = useComposeEmail();
  const movePhotos = useMovePhotos();
  const [moveSheetOpen, setMoveSheetOpen] = useState(false);

  usePageTitle(
    property.data && unit.data ? `Select · ${unit.data.name}` : 'Select to send',
  );

  useEffect(() => () => clear(), [clear]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (moveSheetOpen) return;
        clear();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clear, moveSheetOpen]);

  const allPhotos = useMemo<Photo[]>(
    () => [...(propertyPhotos.data ?? []), ...(unitPhotos.data ?? [])],
    [propertyPhotos.data, unitPhotos.data],
  );
  const selectedPhotos = useMemo<Photo[]>(
    () => allPhotos.filter((p) => ids.has(p.id)),
    [allPhotos, ids],
  );
  const selectedDocs = useMemo<ComplianceDocument[]>(
    () => (compliance.data ?? []).filter((d) => docIds.has(d.id)),
    [compliance.data, docIds],
  );
  const totalSelected = selectedPhotos.length + selectedDocs.length;

  const movableUnitPhotoIds = useMemo(
    () => Array.from(ids).filter((pid) => (unitPhotos.data ?? []).some((p) => p.id === pid)),
    [ids, unitPhotos.data],
  );
  const canMove = movableUnitPhotoIds.length > 0;

  const onCompose = async () => {
    try {
      await compose({
        photos: selectedPhotos,
        documents: selectedDocs,
        unitId: id,
        propertyId,
        unitName: unit.data?.name,
        propertyName: property.data?.name,
      });
      clear();
      navigate(-1);
    } catch {
      // toast already shown
    }
  };

  const onMovePick = async (target: Unit) => {
    try {
      await movePhotos.mutateAsync({
        photoIds: movableUnitPhotoIds,
        targetUnitId: target.id,
        sourceUnitIds: [id],
      });
      toast.success(`Moved to ${target.name}`);
      setMoveSheetOpen(false);
      clear();
      navigate(-1);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not move photos');
    }
  };

  const isLoading = unitPhotos.isLoading || propertyPhotos.isLoading || compliance.isLoading;
  const propertyList = propertyPhotos.data ?? [];
  const unitList = unitPhotos.data ?? [];
  const docList = compliance.data ?? [];

  return (
    <>
      <TopBar title="Select to send" subtitle={unit.data?.name} showBack />
      <PageContainer>
        <p className="px-1 pb-3 text-[13px] text-muted dark:text-muted-dark">
          Pick photos and compliance documents. Tap Move to shift unit photos to another unit, or
          Compose Email to send.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : allPhotos.length === 0 && docList.length === 0 ? (
          <EmptyState
            icon={<Images size={22} strokeWidth={1.75} />}
            title="Nothing to share yet"
            description="Add photos to the unit or property — or upload compliance documents — and they'll show up here."
          />
        ) : (
          <>
            {propertyList.length > 0 ? (
              <section className="mb-4">
                <div className="flex items-baseline justify-between px-1 mb-2">
                  <h3 className="text-[15px] font-semibold">Property Photos</h3>
                  {property.data ? (
                    <span className="text-[12px] text-muted dark:text-muted-dark truncate">
                      from {property.data.name}
                    </span>
                  ) : null}
                </div>
                <PhotoGrid
                  photos={propertyList}
                  selectable
                  selectedIds={ids}
                  onTogglePhoto={(p) => toggle(p.id)}
                />
              </section>
            ) : null}

            <section className="mb-4">
              <h3 className="text-[15px] font-semibold mb-2 px-1">Unit Photos</h3>
              {unitList.length > 0 ? (
                <PhotoGrid
                  photos={unitList}
                  selectable
                  selectedIds={ids}
                  onTogglePhoto={(p) => toggle(p.id)}
                />
              ) : (
                <div className="rounded-card border border-dashed border-border dark:border-border-dark p-4 text-[13px] text-muted dark:text-muted-dark italic">
                  No unit photos yet.
                </div>
              )}
            </section>

            {docList.length > 0 ? (
              <section className="mt-5">
                <h3 className="text-[15px] font-semibold mb-2 px-1">
                  Property Compliance Documents
                </h3>
                {COMPLIANCE_CATEGORIES.map((c) => {
                  const inCat = docList.filter((d) => d.category === c.value);
                  if (inCat.length === 0) return null;
                  return (
                    <div key={c.value} className="mb-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-muted-dark mb-1.5 px-1">
                        {c.label}
                      </div>
                      {inCat.map((doc) => (
                        <SelectableDocRow
                          key={doc.id}
                          doc={doc}
                          selected={docIds.has(doc.id)}
                          onClick={() => toggleDoc(doc.id)}
                        />
                      ))}
                    </div>
                  );
                })}
              </section>
            ) : null}
          </>
        )}
      </PageContainer>

      <ComposeEmailBar
        count={totalSelected}
        onCompose={onCompose}
        onMove={canMove ? () => setMoveSheetOpen(true) : undefined}
        pending={pending}
      />

      <MoveToUnitSheet
        open={moveSheetOpen}
        propertyId={propertyId}
        excludeUnitId={id}
        loading={movePhotos.isPending}
        onClose={() => setMoveSheetOpen(false)}
        onPick={onMovePick}
      />
    </>
  );
}
