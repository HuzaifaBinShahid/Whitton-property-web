import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { UnitCategory } from '@/types/db';
import { UNIT_CATEGORIES } from '../categories';
import { UnitCategoryBadge } from './UnitCategoryBadge';
import { useUpdateUnit } from '../hooks';
import { cn } from '@/utils/cn';

type Props = {
  unitId: string;
  open: boolean;
  initial: UnitCategory;
  onClose: () => void;
};

export function UnitCategoryEditModal({ unitId, open, initial, onClose }: Props) {
  const [value, setValue] = useState<UnitCategory>(initial);
  const update = useUpdateUnit(unitId);

  useEffect(() => {
    if (open) setValue(initial);
  }, [open, initial]);

  const save = async () => {
    try {
      await update.mutateAsync({ category: value });
      toast.success('Category updated');
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not update category');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Unit category"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={update.isPending}>
            Cancel
          </Button>
          <Button onClick={save} loading={update.isPending}>
            Save
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-2">
        {UNIT_CATEGORIES.map((c) => {
          const active = c.value === value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue(c.value)}
              className={cn(
                'flex items-center gap-3 rounded-card border p-3 text-left transition-all',
                active
                  ? 'border-accent ring-1 ring-accent/30 bg-accent/5 dark:border-accent-dark dark:ring-accent-dark/30 dark:bg-accent-dark/5'
                  : 'border-border dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40',
              )}
            >
              <UnitCategoryBadge value={c.value} />
              <span className="ml-auto text-[12px] text-muted dark:text-muted-dark">
                {active ? 'Selected' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
