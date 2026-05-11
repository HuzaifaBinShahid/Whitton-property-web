import { Bed, Bath, Sofa } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { UnitDimensionsPatch } from '../api';

const ROWS: {
  icon: React.ReactNode;
  label: string;
  lk: keyof UnitDimensionsPatch;
  wk: keyof UnitDimensionsPatch;
}[] = [
  {
    icon: <Bed size={16} strokeWidth={1.75} />,
    label: 'Room',
    lk: 'room_length_m',
    wk: 'room_width_m',
  },
  {
    icon: <Bath size={16} strokeWidth={1.75} />,
    label: 'Toilet',
    lk: 'toilet_length_m',
    wk: 'toilet_width_m',
  },
  {
    icon: <Sofa size={16} strokeWidth={1.75} />,
    label: 'Living + Kitchen',
    lk: 'living_kitchen_length_m',
    wk: 'living_kitchen_width_m',
  },
];

type Props = {
  value: UnitDimensionsPatch;
  onChange: (next: UnitDimensionsPatch) => void;
};

function parse(v: string): number | null {
  if (v.trim() === '') return null;
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  if (n < 0) return 0;
  if (n > 99.99) return 99.99;
  return Math.round(n * 100) / 100;
}

function area(l: number | null | undefined, w: number | null | undefined): string {
  if (typeof l !== 'number' || typeof w !== 'number') return '—';
  const a = Math.round(l * w * 100) / 100;
  return `${a.toFixed(2)} m²`;
}

export function DimensionsFields({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {ROWS.map((row) => {
        const l = value[row.lk] ?? null;
        const w = value[row.wk] ?? null;
        return (
          <div key={row.label} className="rounded-card border border-border dark:border-border-dark p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex h-6 w-6 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                {row.icon}
              </div>
              <div className="text-[13px] font-semibold">{row.label}</div>
              <div className="ml-auto text-[12px] text-muted dark:text-muted-dark">{area(l, w)}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Length (m)"
                type="number"
                inputMode="decimal"
                step="0.01"
                min={0}
                max={99.99}
                placeholder="0.00"
                value={l === null ? '' : String(l)}
                onChange={(e) => onChange({ ...value, [row.lk]: parse(e.target.value) })}
              />
              <Input
                label="Width (m)"
                type="number"
                inputMode="decimal"
                step="0.01"
                min={0}
                max={99.99}
                placeholder="0.00"
                value={w === null ? '' : String(w)}
                onChange={(e) => onChange({ ...value, [row.wk]: parse(e.target.value) })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
