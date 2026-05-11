import { useState } from 'react';
import { Flame, Lightbulb, Droplets, ScrollText, Pencil } from 'lucide-react';
import type { Property, UtilityKey } from '@/types/db';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { UtilityEditModal } from './UtilityEditModal';

type Item = {
  key: UtilityKey;
  label: string;
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  { key: 'gas_provider', label: 'Gas', icon: <Flame size={16} strokeWidth={1.75} /> },
  { key: 'electric_provider', label: 'Electric', icon: <Lightbulb size={16} strokeWidth={1.75} /> },
  { key: 'water_provider', label: 'Water', icon: <Droplets size={16} strokeWidth={1.75} /> },
  {
    key: 'council_tax_provider',
    label: 'Council Tax',
    icon: <ScrollText size={16} strokeWidth={1.75} />,
  },
];

type Props = {
  property: Property;
};

export function UtilitiesSection({ property }: Props) {
  const [editing, setEditing] = useState<Item | null>(null);

  return (
    <section>
      <h3 className="text-[15px] font-semibold mb-2 px-1">Utility Providers</h3>
      <Card>
        <ul className="divide-y divide-border dark:divide-border-dark">
          {ITEMS.map((item) => {
            const value = property[item.key];
            return (
              <li
                key={item.key}
                className="flex items-center gap-3 px-3.5 py-3"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-tile bg-accent/10 text-accent dark:bg-accent-dark/15 dark:text-accent-dark">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] uppercase tracking-wider font-semibold text-muted dark:text-muted-dark">
                    {item.label}
                  </div>
                  <div
                    className={
                      value
                        ? 'text-[14px] truncate'
                        : 'text-[14px] text-muted dark:text-muted-dark italic'
                    }
                  >
                    {value || 'Not set'}
                  </div>
                </div>
                <IconButton ariaLabel={`Edit ${item.label}`} onClick={() => setEditing(item)}>
                  <Pencil size={16} strokeWidth={1.75} />
                </IconButton>
              </li>
            );
          })}
        </ul>
      </Card>

      <UtilityEditModal
        propertyId={property.id}
        open={editing !== null}
        utilityKey={editing?.key ?? 'gas_provider'}
        label={editing?.label ?? ''}
        initialValue={editing ? property[editing.key] : null}
        onClose={() => setEditing(null)}
      />
    </section>
  );
}
