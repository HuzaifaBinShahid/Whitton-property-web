import { Bed, Bath, Sofa } from 'lucide-react';
import type { Unit } from '@/types/db';
import { Card } from '@/components/ui/Card';

type Row = {
  icon: React.ReactNode;
  label: string;
  l: number | null;
  w: number | null;
};

function area(l: number | null, w: number | null): string {
  if (l === null || w === null) return '—';
  const a = Math.round(l * w * 100) / 100;
  return `${a.toFixed(2)} m²`;
}

function dim(n: number | null): string {
  return n === null ? '—' : n.toFixed(2);
}

type Props = {
  unit: Unit;
};

export function UnitDimensions({ unit }: Props) {
  const rows: Row[] = [
    {
      icon: <Bed size={16} strokeWidth={1.75} />,
      label: 'Room',
      l: unit.room_length_m,
      w: unit.room_width_m,
    },
    {
      icon: <Bath size={16} strokeWidth={1.75} />,
      label: 'Toilet',
      l: unit.toilet_length_m,
      w: unit.toilet_width_m,
    },
    {
      icon: <Sofa size={16} strokeWidth={1.75} />,
      label: 'Living + Kitchen',
      l: unit.living_kitchen_length_m,
      w: unit.living_kitchen_width_m,
    },
  ];

  const anyValue = rows.some((r) => r.l !== null || r.w !== null);
  if (!anyValue) {
    return (
      <Card className="p-4 text-[13px] text-muted dark:text-muted-dark italic">
        No dimensions recorded yet.
      </Card>
    );
  }

  return (
    <Card>
      <ul className="divide-y divide-border dark:divide-border-dark">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-3 px-3.5 py-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
              {r.icon}
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{r.label}</div>
              <div className="text-[12px] text-muted dark:text-muted-dark">
                {dim(r.l)} × {dim(r.w)} m
              </div>
            </div>
            <div className="text-[13px] font-semibold tabular-nums">{area(r.l, r.w)}</div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
