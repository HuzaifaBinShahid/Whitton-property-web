import { BarChart3, DoorOpen, Home, Image, Mail } from 'lucide-react';
import { TopBar } from '@/components/layout/TopBar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useRecentEmails, useStatsCounts } from '@/features/stats/hooks';
import { StatCard } from '@/features/stats/components/StatCard';
import { SentEmailRow } from '@/features/stats/components/SentEmailRow';
import { usePageTitle } from '@/utils/usePageTitle';

export function StatsPage() {
  const counts = useStatsCounts();
  const recent = useRecentEmails();
  usePageTitle('Stats');

  return (
    <>
      <TopBar />
      <PageContainer>
        <div className="mb-5 px-1">
          <h1 className="text-[28px] font-semibold">Stats</h1>
          <p className="text-[13px] text-muted dark:text-muted-dark">
            Activity across all your properties.
          </p>
        </div>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {counts.isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
          ) : (
            <>
              <StatCard
                label="Properties"
                value={counts.data?.properties ?? 0}
                icon={<Home size={16} strokeWidth={1.75} />}
                index={0}
              />
              <StatCard
                label="Units"
                value={counts.data?.units ?? 0}
                icon={<DoorOpen size={16} strokeWidth={1.75} />}
                index={1}
              />
              <StatCard
                label="Photos"
                value={counts.data?.photos ?? 0}
                icon={<Image size={16} strokeWidth={1.75} />}
                index={2}
              />
              <StatCard
                label="Emails sent"
                value={counts.data?.emails ?? 0}
                icon={<Mail size={16} strokeWidth={1.75} />}
                index={3}
              />
            </>
          )}
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-[15px] font-semibold">Recent emails</h3>
            <span className="text-[12px] text-muted dark:text-muted-dark">
              {recent.data?.length ?? 0}
            </span>
          </div>
          {recent.isLoading ? (
            <Card>
              <div className="p-3 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </Card>
          ) : recent.data && recent.data.length > 0 ? (
            <Card>
              {recent.data.map((e, i) => (
                <SentEmailRow key={e.id} email={e} index={i} />
              ))}
            </Card>
          ) : (
            <EmptyState
              icon={<BarChart3 size={22} strokeWidth={1.75} />}
              title="No emails sent yet"
              description="Open a unit, select photos, and compose an email — it'll appear here."
            />
          )}
        </section>
      </PageContainer>
    </>
  );
}
