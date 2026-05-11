import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

type Initial = {
  name: string;
  address?: string | null;
  notes?: string | null;
};

type Props = {
  initial?: Initial;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: { name: string; address: string | null; notes: string | null }) => void;
  onCancel?: () => void;
};

export function PropertyForm({ initial, submitLabel = 'Save', loading, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Name is required');
      return;
    }
    onSubmit({
      name: trimmed,
      address: address.trim() ? address.trim() : null,
      notes: notes.trim() ? notes.trim() : null,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Input
        label="Property name"
        placeholder="e.g. 12 Whitton Avenue"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError(null);
        }}
        error={nameError}
        autoFocus
        maxLength={120}
      />
      <Input
        label="Address"
        placeholder="Street, city, postcode"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Textarea
        label="Notes"
        placeholder="Anything worth remembering about this property"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />
      <div className="flex justify-end gap-2 mt-2">
        {onCancel ? (
          <Button variant="ghost" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
