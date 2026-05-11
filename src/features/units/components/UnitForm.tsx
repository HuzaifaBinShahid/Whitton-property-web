import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { UNIT_CATEGORIES } from '../categories';
import type { UnitCategory } from '@/types/db';
import { DimensionsFields } from './DimensionsFields';
import type { UnitDimensionsPatch } from '../api';
import { UnitCategoryBadge } from './UnitCategoryBadge';
import { cn } from '@/utils/cn';

type Values = {
  name: string;
  category: UnitCategory;
  notes: string | null;
  dimensions: UnitDimensionsPatch;
};

type Props = {
  initial?: Partial<Values>;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: Values) => void;
  onCancel?: () => void;
};

export function UnitForm({ initial, submitLabel = 'Save', loading, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState<UnitCategory>(
    initial?.category ?? 'fully_self_contained',
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [dimensions, setDimensions] = useState<UnitDimensionsPatch>(initial?.dimensions ?? {});
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
      category,
      notes: notes.trim() ? notes.trim() : null,
      dimensions,
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Input
        label="Unit name"
        placeholder="e.g. Flat 2"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError(null);
        }}
        error={nameError}
        autoFocus
        maxLength={80}
      />

      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-semibold uppercase tracking-wider text-muted dark:text-muted-dark">
          Category
        </label>
        <div className="grid grid-cols-2 gap-2">
          {UNIT_CATEGORIES.map((c) => {
            const active = c.value === category;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={cn(
                  'text-left rounded-card border px-3 py-3 transition-all',
                  active
                    ? 'border-accent ring-1 ring-accent/30 bg-accent/5 dark:border-accent-dark dark:ring-accent-dark/30 dark:bg-accent-dark/5'
                    : 'border-border dark:border-border-dark hover:border-accent/40 dark:hover:border-accent-dark/40',
                )}
              >
                <UnitCategoryBadge value={c.value} short />
                <div className="text-[13px] mt-1.5 text-muted dark:text-muted-dark">{c.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <Textarea
        label="Notes"
        placeholder="Anything specific about this unit"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      <div>
        <label className="text-[12px] font-semibold uppercase tracking-wider text-muted dark:text-muted-dark mb-2 block">
          Dimensions (optional)
        </label>
        <DimensionsFields value={dimensions} onChange={setDimensions} />
      </div>

      <div className="flex justify-end gap-2 mt-1">
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
