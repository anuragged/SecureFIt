'use server';
/**
 * @fileOverview A flow for generating a diet plan based on user profile.
 *
 * - suggestDietPlan - A function that generates a diet plan.
 * - DietPlanInput - The input type for the suggestDietPlan function.
 * - DietPlanOutput - The return type for the suggestDietPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { UserProfile } from '@/lib/types';

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

const dietPrompt = ai.definePrompt({
  name: 'dietPrompt',
  input: { schema: DietPlanInputSchema },
  output: { schema: DietPlanOutputSchema },
  prompt: `You are an expert nutritionist. Based on the following user profile, create a balanced and healthy 1-day diet plan.

User Profile:
- Age: {{calculateAge userProfile.dateOfBirth}}
- Gender: {{userProfile.gender}}
- Height: {{userProfile.height}} cm
- Weight: {{userProfile.weight}} kg
- Fitness Goals: {{userProfile.fitnessGoals}}

Provide a variety of options for each meal. The diet should be tailored to the user's goals.
Also provide a brief summary explaining your recommendations.
`,
  helpers: {
    calculateAge: (dateOfBirth: string | undefined) => {
      if (!dateOfBirth) return 'N/A';
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  }
});


const suggestDietPlanFlow = ai.defineFlow(
  {
    name: 'suggestDietPlanFlow',
    inputSchema: DietPlanInputSchema,
    outputSchema: DietPlanOutputSchema,
  },
  async (input) => {
    const { output } = await dietPrompt(input);
    return output!;
  }
);

export async function suggestDietPlan(input: DietPlanInput): Promise<DietPlanOutput> {
  return suggestDietPlanFlow(input);
}
