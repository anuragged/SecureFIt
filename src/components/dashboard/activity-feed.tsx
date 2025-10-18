"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { WorkoutSession } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';

export function ActivityFeed() {
  const { user } = useUser();
  const firestore = useFirestore();

  const workoutSessionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/workoutSessions`),
      orderBy("startTime", "desc"),
      limit(5)
    );
  }, [user, firestore]);
  
  const { data: activities, isLoading } = useCollection<WorkoutSession>(workoutSessionsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>An overview of your latest workouts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p>Loading activities...</p>}
        {!isLoading && (!activities || activities.length === 0) && <p>No recent activities found.</p>}
        {activities?.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <span className="text-sm font-bold text-secondary-foreground">
                {activity.activityType.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">{activity.activityType}</p>
              <p className="text-sm text-muted-foreground">
                {activity.duration} mins - {activity.caloriesBurned} kcal
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.startTime), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
