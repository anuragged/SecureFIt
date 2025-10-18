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

export const UserProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  height: z.number().optional(), // in cm
  weight: z.number().optional(), // in kg
  fitnessGoals: z.string().optional(),
});


export type UserProfile = z.infer<typeof UserProfileSchema>;

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
    gender: z.string().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    fitnessGoals: z.string().optional(),
    dateOfBirth: z.string().optional(),
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
