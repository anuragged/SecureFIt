'use server';
/**
 * @fileOverview A flow for generating a diet plan based on user profile.
 *
 * - suggestDietPlan - A function that generates a diet plan.
 */

import { ai } from '@/ai/genkit';
import { DietPlanInputSchema, DietPlanOutputSchema, type DietPlanInput, type DietPlanOutput } from '@/lib/types';

// New input schema for the prompt, including the calculated age.
const DietPromptInputSchema = DietPlanInputSchema.extend({
  age: z.union([z.number(), z.string()]).describe("The user's calculated age."),
});


const dietPrompt = ai.definePrompt({
  name: 'dietPrompt',
  input: { schema: DietPromptInputSchema },
  output: { schema: DietPlanOutputSchema },
  prompt: `You are an expert nutritionist. Based on the following user profile, create a balanced and healthy 1-day diet plan.

User Profile:
- Age: {{age}}
- Gender: {{userProfile.gender}}
- Height: {{userProfile.height}} cm
- Weight: {{userProfile.weight}} kg
- Fitness Goals: {{userProfile.fitnessGoals}}

Provide a variety of options for each meal. The diet should be tailored to the user's goals.
Also provide a brief summary explaining your recommendations.
`,
});


const suggestDietPlanFlow = ai.defineFlow(
  {
    name: 'suggestDietPlanFlow',
    inputSchema: DietPlanInputSchema,
    outputSchema: DietPlanOutputSchema,
  },
  async (input) => {
    const calculateAge = (dateOfBirth: string | undefined) => {
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
    
    const age = calculateAge(input.userProfile.dateOfBirth);
    
    const { output } = await dietPrompt({ ...input, age });
    return output!;
  }
);

export async function suggestDietPlan(input: DietPlanInput): Promise<DietPlanOutput> {
  return suggestDietPlanFlow(input);
}
