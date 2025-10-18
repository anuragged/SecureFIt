"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flame, Footprints, HeartPulse, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where, Timestamp } from "firebase/firestore";
import type { WorkoutSession } from "@/lib/types";
import { useEffect, useState } from "react";

const fitnessStatConfig = [
  {
    title: "Calories Burned",
    key: "caloriesBurned",
    icon: Flame,
    color: "text-red-500",
  },
  {
    title: "Steps Taken",
    key: "steps",
    icon: Footprints,
    color: "text-blue-500",
  },
  {
    title: "Active Time",
    key: "duration",
    icon: HeartPulse,
    color: "text-green-500",
  },
  {
    title: "Workouts",
    key: "workouts",
    icon: Dumbbell,
    color: "text-purple-500",
  },
];

export function StatsCards() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [stats, setStats] = useState({
    caloriesBurned: 0,
    steps: 0, // Placeholder as it's not in WorkoutSession
    duration: 0,
    workouts: 0,
  });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);

  const weeklyWorkoutsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/workoutSessions`),
      where("startTime", ">=", sevenDaysAgoTimestamp)
    );
  }, [user, firestore]);

  const { data: weeklyWorkouts } = useCollection<WorkoutSession>(weeklyWorkoutsQuery);

  useEffect(() => {
    if (weeklyWorkouts) {
      const newStats = weeklyWorkouts.reduce(
        (acc, session) => {
          acc.caloriesBurned += session.caloriesBurned;
          acc.duration += session.duration;
          return acc;
        },
        { caloriesBurned: 0, duration: 0, workouts: weeklyWorkouts.length }
      );
      setStats(prev => ({...prev, ...newStats}));
    }
  }, [weeklyWorkouts]);


  const formatValue = (key: string, value: number) => {
    if (key === 'duration') {
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return `${hours}h ${minutes}m`;
    }
    if (key === 'caloriesBurned' || key === 'steps' || key === 'workouts') {
      return value.toLocaleString();
    }
    return value;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {fitnessStatConfig.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={cn("h-4 w-4 text-muted-foreground", stat.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatValue(stat.key, stats[stat.key as keyof typeof stats])}</div>
            <p className="text-xs text-muted-foreground">in the last 7 days</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
