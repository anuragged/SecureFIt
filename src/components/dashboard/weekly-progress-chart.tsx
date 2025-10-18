"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, where, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { format, subDays } from 'date-fns';
import type { WorkoutSession } from "@/lib/types";

const chartConfig = {
  value: {
    label: "Calories",
    color: "hsl(var(--chart-1))",
  },
};

export function WeeklyProgressChart() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [chartData, setChartData] = useState<Array<{ day: string; value: number }>>([]);

  const sevenDaysAgo = subDays(new Date(), 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
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
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), i);
        return format(d, 'E');
    }).reverse();
    
    const data = days.map(day => ({ day, value: 0 }));

    if (weeklyWorkouts) {
      weeklyWorkouts.forEach(session => {
        const day = format(new Date(session.startTime), 'E');
        const dayIndex = data.findIndex(d => d.day === day);
        if (dayIndex !== -1) {
          data[dayIndex].value += session.caloriesBurned;
        }
      });
    }
    setChartData(data);
  }, [weeklyWorkouts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
        <CardDescription>Calories burned this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="value" fill="var(--color-chart-1)" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
