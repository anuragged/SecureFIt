'use client';

import { StatsCards } from "@/components/dashboard/stats-cards";
import { WeeklyProgressChart } from "@/components/dashboard/weekly-progress-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { useUser } from "@/firebase";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <>
      <div>
        <h1 className="text-2xl font-headline font-bold tracking-tight">
          Welcome back, {user?.displayName?.split(' ')[0] || 'friend'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s a look at your fitness journey today.
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WeeklyProgressChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </>
  );
}
