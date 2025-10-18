import { z } from 'zod';

export interface WorkoutSession {
  id: string;
  userId: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  activityType: string;
  duration: number; // in minutes
  caloriesBurned: number;
  distance?: number; // in kilometers
  notes?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number; // in cm
  weight?: number; // in kg
  fitnessGoals?: string;
}

export interface FitnessMetric {
  id: string;
  userId: string;
  timestamp: string; // ISO 8601 format
  metricType: string;
  metricValue: number;
  unit: string;
}

// AI Diet Plan Types

export const DietPlanInputSchema = z.object({
  userProfile: z.custom<UserProfile>()
});

export type DietPlanInput = z.infer<typeof DietPlanInputSchema>;

export const DietPlanOutputSchema = z.object({
  dietPlan: z.object({
    breakfast: z.array(z.string()).describe("List of breakfast options."),
    lunch: z.array(z.string()).describe("List of lunch options."),
    dinner: z.array(z.string()).describe("List of dinner options."),
    snacks: z.array(z.string()).describe("List of snack options."),
  }),
  summary: z.string().describe("A brief summary of the diet plan and why it's suitable for the user.")
});

export type DietPlanOutput = z.infer<typeof DietPlanOutputSchema>;
