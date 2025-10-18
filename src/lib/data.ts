import { Flame, Footprints, HeartPulse, Dumbbell } from "lucide-react";

export const fitnessStats = [
  {
    title: "Calories Burned",
    value: "2,380",
    change: "+15%",
    icon: Flame,
    color: "text-red-500",
  },
  {
    title: "Steps Taken",
    value: "12,450",
    change: "+8%",
    icon: Footprints,
    color: "text-blue-500",
  },
  {
    title: "Active Time",
    value: "2h 45m",
    change: "+20%",
    icon: HeartPulse,
    color: "text-green-500",
  },
  {
    title: "Workouts",
    value: "4",
    change: "This Week",
    icon: Dumbbell,
    color: "text-purple-500",
  },
];

export const weeklyProgressData = [
  { day: "Mon", value: 300 },
  { day: "Tue", value: 450 },
  { day: "Wed", value: 600 },
  { day: "Thu", value: 500 },
  { day: "Fri", value: 800 },
  { day: "Sat", value: 1200 },
  { day: "Sun", value: 900 },
];

export const activityFeed = [
  {
    id: 1,
    activity: "Morning Run",
    details: "Completed a 5k run in 28 minutes.",
    time: "2 hours ago",
  },
  {
    id: 2,
    activity: "Weight Training",
    details: "Upper body workout session.",
    time: "1 day ago",
  },
  {
    id: 3,
    activity: "Yoga Session",
    details: "45 minutes of vinyasa flow.",
    time: "2 days ago",
  },
  {
    id: 4,
    activity: "Evening Walk",
    details: "30-minute brisk walk.",
    time: "2 days ago",
  },
    {
    id: 5,
    activity: "HIIT Workout",
    details: "20-minute high-intensity interval training.",
    time: "3 days ago",
  },
];
