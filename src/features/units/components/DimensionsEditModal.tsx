import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { DimensionsFields } from './DimensionsFields';
import type { Unit } from '@/types/db';
import type { UnitDimensionsPatch } from '../api';
import { useUpdateUnit } from '../hooks';

type Props = {
  unit: Unit;
  open: boolean;
  onClose: () => void;
};

function pick(unit: Unit): UnitDimensionsPatch {
  return {
    room_length_m: unit.room_length_m,
    room_width_m: unit.room_width_m,
    toilet_length_m: unit.toilet_length_m,
    toilet_width_m: unit.toilet_width_m,
    living_kitchen_length_m: unit.living_kitchen_length_m,
    living_kitchen_width_m: unit.living_kitchen_width_m,
  };
}

export function DimensionsEditModal({ unit, open, onClose }: Props) {
  const [value, setValue] = useState<UnitDimensionsPatch>(pick(unit));
  const update = useUpdateUnit(unit.id);

  useEffect(() => {
    if (open) setValue(pick(unit));
  }, [open, unit]);

  const save = async () => {
    try {
      await update.mutateAsync(value);
      toast.success('Dimensions updated');
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not update dimensions');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Unit dimensions"
      size="lg"
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
      <DimensionsFields value={value} onChange={setValue} />
    </Modal>
  );
}
