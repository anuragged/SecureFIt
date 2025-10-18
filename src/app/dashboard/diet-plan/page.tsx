'use client';

import { useState } from 'react';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile, DietPlanOutput } from '@/lib/types';
import { suggestDietPlan } from '@/ai/flows/suggest-diet-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Utensils } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DietPlanPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [dietPlan, setDietPlan] = useState<DietPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userProfileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users`, user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);


  const generatePlan = async () => {
    if (!userProfile) {
      setError("User profile is not available to generate a diet plan.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const plan = await suggestDietPlan({ userProfile });
      setDietPlan(plan);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate diet plan.");
    }
    setIsLoading(false);
  };
  
  if (isProfileLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-bold tracking-tight">Your Personal Diet Plan</h1>
          <p className="text-muted-foreground">
            An AI-powered diet suggestion based on your profile and goals.
          </p>
        </div>
        <Button onClick={generatePlan} disabled={isLoading || !userProfile}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Utensils className="mr-2 h-4 w-4" />
              {dietPlan ? 'Regenerate Plan' : 'Generate Plan'}
            </>
          )}
        </Button>
      </div>

      {error && (
         <Alert variant="destructive">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!dietPlan && !isLoading && (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Ready for your diet plan?</CardTitle>
            <CardDescription>Click the button to get a personalized diet plan.</CardDescription>
          </CardHeader>
          <CardContent>
             <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>
      )}

      {dietPlan && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{dietPlan.summary}</p>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MealCard title="Breakfast" options={dietPlan.dietPlan.breakfast} />
            <MealCard title="Lunch" options={dietPlan.dietPlan.lunch} />
            <MealCard title="Dinner" options={dietPlan.dietPlan.dinner} />
            <MealCard title="Snacks" options={dietPlan.dietPlan.snacks} />
          </div>
        </div>
      )}
    </div>
  );
}

function MealCard({ title, options }: { title: string; options: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          {options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
