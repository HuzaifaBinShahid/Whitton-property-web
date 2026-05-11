import { DoorOpen } from 'lucide-react';
import type { Unit } from '@/types/db';
import { Sheet } from '@/components/ui/Sheet';
import { Skeleton } from '@/components/ui/Skeleton';
import { useUnitsByProperty } from '@/features/units/hooks';
import { UnitCategoryBadge } from '@/features/units/components/UnitCategoryBadge';

type Props = {
  open: boolean;
  propertyId: string;
  excludeUnitId: string;
  loading?: boolean;
  onClose: () => void;
  onPick: (unit: Unit) => void;
};

export function MoveToUnitSheet({ open, propertyId, excludeUnitId, loading, onClose, onPick }: Props) {
  const units = useUnitsByProperty(propertyId);
  const list = (units.data ?? []).filter((u) => u.id !== excludeUnitId);

  return (
    <Sheet open={open} onClose={onClose} title="Move to unit">
      {units.isLoading ? (
        <div className="flex flex-col gap-2 px-2 pb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center text-[14px] text-muted dark:text-muted-dark py-8">
          No other units in this property.
        </div>
      ) : (
        <ul className="flex flex-col gap-1 px-2 pb-2">
          {list.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => onPick(u)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-tile hover:bg-border/40 dark:hover:bg-border-dark/40 transition-colors disabled:opacity-50"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                  <DoorOpen size={16} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[14px] font-semibold truncate">{u.name}</div>
                </div>
                <UnitCategoryBadge value={u.category} short />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
