import type { ComplianceCategory } from '@/types/db';

export type ComplianceCategoryMeta = {
  value: ComplianceCategory;
  label: string;
  short: string;
};

export const COMPLIANCE_CATEGORIES: readonly ComplianceCategoryMeta[] = [
  { value: 'gas', label: 'Gas', short: 'Gas' },
  { value: 'ecir', label: 'ECIR', short: 'ECIR' },
  { value: 'fra', label: 'FRA', short: 'FRA' },
  { value: 'fire_detection', label: 'Fire Detection System', short: 'Fire Detect.' },
  { value: 'emergency_lighting', label: 'Emergency Lighting', short: 'Em. Lighting' },
  { value: 'epc', label: 'EPC', short: 'EPC' },
] as const;

const COMPLIANCE_CATEGORY_MAP: Record<ComplianceCategory, ComplianceCategoryMeta> =
  COMPLIANCE_CATEGORIES.reduce(
    (acc, c) => {
      acc[c.value] = c;
      return acc;
    },
    {} as Record<ComplianceCategory, ComplianceCategoryMeta>,
  );

export function complianceCategoryMeta(value: ComplianceCategory): ComplianceCategoryMeta {
  return COMPLIANCE_CATEGORY_MAP[value];
}
