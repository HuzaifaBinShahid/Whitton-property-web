import type { UnitCategory } from '@/types/db';
import { unitCategoryMeta, UNIT_CATEGORY_TONE_CLASSES } from '../categories';
import { cn } from '@/utils/cn';

type Props = {
  value: UnitCategory;
  short?: boolean;
  className?: string;
};

export function UnitCategoryBadge({ value, short, className }: Props) {
  const meta = unitCategoryMeta(value);
  const tone = UNIT_CATEGORY_TONE_CLASSES[meta.tone];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-0.5 text-[12px] font-semibold ring-1',
        tone.bg,
        tone.text,
        tone.ring,
        className,
      )}
    >
      {short ? meta.short : meta.label}
    </span>
  );
}
