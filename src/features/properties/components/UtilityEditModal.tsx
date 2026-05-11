import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { UtilityKey } from '@/types/db';
import { useUpdateProperty } from '../hooks';

type Props = {
  propertyId: string;
  open: boolean;
  utilityKey: UtilityKey;
  label: string;
  initialValue: string | null;
  onClose: () => void;
};

export function UtilityEditModal({
  propertyId,
  open,
  utilityKey,
  label,
  initialValue,
  onClose,
}: Props) {
  const [value, setValue] = useState(initialValue ?? '');
  const update = useUpdateProperty(propertyId);

  useEffect(() => {
    if (open) setValue(initialValue ?? '');
  }, [open, initialValue]);

  const save = async () => {
    try {
      await update.mutateAsync({ [utilityKey]: value.trim() || null });
      toast.success(`${label} updated`);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : `Could not update ${label}`);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${label} provider`}
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
      <Input
        label="Provider name"
        placeholder="e.g. British Gas"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        maxLength={120}
      />
    </Modal>
  );
}
