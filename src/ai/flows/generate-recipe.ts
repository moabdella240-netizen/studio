'use server';

/**
 * @fileOverview A flow for generating healthy recipes based on user preferences.
 *
 * - generateRecipe - A function that generates a recipe.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRecipeInputSchema = z.object({
  diet: z.string().optional().describe('The dietary preference (e.g., vegetarian, vegan, gluten-free).'),
  cuisine: z.string().optional().describe('The type of cuisine (e.g., Eritrean, Mediterranean, International).'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional().describe('The cooking difficulty level.'),
  maxTime: z.number().optional().describe('The maximum cooking time in minutes.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const NutritionInfoSchema = z.object({
    calories: z.string().describe('Estimated calories per serving.'),
    protein: z.string().describe('Estimated protein per serving.'),
    carbs: z.string().describe('Estimated carbohydrates per serving.'),
    fat: z.string().describe('Estimated fat per serving.'),
});

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  description: z.string().describe('A short, appetizing description of the dish.'),
  ingredients: z.array(z.string()).describe('A list of ingredients.'),
  instructions: z.array(z.string()).describe('The step-by-step cooking instructions.'),
  nutrition: NutritionInfoSchema.describe('Estimated nutritional information per serving.'),
  imagePrompt: z.string().describe('A detailed prompt for an AI image generator to create a beautiful, appetizing photo of the finished dish.')
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: { schema: GenerateRecipeInputSchema },
  output: { schema: GenerateRecipeOutputSchema },
  prompt: `You are a creative chef who specializes in healthy and delicious meals. Generate a single recipe based on the following user preferences.

User Preferences:
{{#if cuisine}}Cuisine: {{{cuisine}}}{{/if}}
{{#if diet}}Diet: {{{diet}}}{{/if}}
{{#if difficulty}}Difficulty: {{{difficulty}}}{{/if}}
{{#if maxTime}}Maximum cook time: {{{maxTime}}} minutes{{/if}}

Your response must include:
1. A creative and appealing 'recipeName'.
2. A short, mouth-watering 'description'.
3. A list of 'ingredients'.
4. A list of step-by-step 'instructions'.
5. Estimated 'nutrition' information (calories, protein, carbs, fat).
6. A detailed 'imagePrompt' for an AI to generate a photorealistic, professional-quality image of the final dish. Describe the plating, lighting, and background.

If no preferences are provided, generate a random popular and healthy recipe. Ensure the recipe is easy to follow.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
