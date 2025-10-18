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
