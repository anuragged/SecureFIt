import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { activityFeed } from "@/lib/data";

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>An overview of your latest workouts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activityFeed.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <span className="text-sm font-bold text-secondary-foreground">
                {activity.activity.charAt(0)}
              </span>
            </div>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">{activity.activity}</p>
              <p className="text-sm text-muted-foreground">{activity.details}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
