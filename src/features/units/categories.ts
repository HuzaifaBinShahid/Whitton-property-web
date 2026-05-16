import type { UnitCategory } from '@/types/db';

export type UnitCategoryTone = 'emerald' | 'amber' | 'violet' | 'slate';

export type UnitCategoryMeta = {
  value: UnitCategory;
  label: string;
  short: string;
  tone: UnitCategoryTone;
};

export const UNIT_CATEGORIES: readonly UnitCategoryMeta[] = [
  { value: 'fully_self_contained', label: 'Fully Self Contained', short: 'Fully SC', tone: 'emerald' },
  { value: 'no_hob_self_contained', label: 'No Hob Self Contained', short: 'No Hob SC', tone: 'amber' },
  { value: 'en_suite', label: 'En suite', short: 'En suite', tone: 'violet' },
  { value: 'shared_bathroom', label: 'Shared Bathroom', short: 'Shared Bath', tone: 'slate' },
] as const;

const UNIT_CATEGORY_MAP: Record<UnitCategory, UnitCategoryMeta> = UNIT_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.value] = c;
    return acc;
  },
  {} as Record<UnitCategory, UnitCategoryMeta>,
);

export function unitCategoryMeta(value: UnitCategory): UnitCategoryMeta {
  return UNIT_CATEGORY_MAP[value];
}

export const UNIT_CATEGORY_TONE_CLASSES: Record<UnitCategoryTone, { bg: string; text: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', ring: 'ring-emerald-500/30' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-400', ring: 'ring-amber-500/30' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-700 dark:text-violet-400', ring: 'ring-violet-500/30' },
  slate: { bg: 'bg-slate-500/15', text: 'text-slate-700 dark:text-slate-300', ring: 'ring-slate-500/30' },
};
