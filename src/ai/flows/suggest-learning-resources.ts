'use server';

/**
 * @fileOverview A flow for suggesting learning resources based on user skill level and learning goals.
 *
 * - suggestLearningResources - A function that suggests learning resources.
 * - SuggestLearningResourcesInput - The input type for the suggestLearningResources function.
 * - SuggestLearningResourcesOutput - The return type for the suggestLearningResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLearningResourcesInputSchema = z.object({
  skillLevel: z
    .string()
    .describe('The current skill level of the user (e.g., beginner, intermediate, expert).'),
  learningGoal: z
    .string()
    .describe('The specific learning goal of the user (e.g., learn Python, master React).'),
  preferredResourceType: z
    .string()
    .optional()
    .describe('The preferred type of learning resource (e.g., video, book, tutorial).'),
});
export type SuggestLearningResourcesInput = z.infer<
  typeof SuggestLearningResourcesInputSchema
>;

const SuggestLearningResourcesOutputSchema = z.object({
  suggestedResources: z
    .array(z.string())
    .describe('A list of suggested learning resources (e.g., URLs, book titles).'),
  reasoning: z
    .string()
    .describe('Explanation of why these learning resources were suggested.'),
});
export type SuggestLearningResourcesOutput = z.infer<
  typeof SuggestLearningResourcesOutputSchema
>;

export async function suggestLearningResources(
  input: SuggestLearningResourcesInput
): Promise<SuggestLearningResourcesOutput> {
  return suggestLearningResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLearningResourcesPrompt',
  input: {schema: SuggestLearningResourcesInputSchema},
  output: {schema: SuggestLearningResourcesOutputSchema},
  prompt: `You are an AI learning resource recommender.

  Based on the user's current skill level: {{{skillLevel}}},
  and their learning goal: {{{learningGoal}}},
  suggest a list of relevant learning resources.

  Consider the user's preferred resource type: {{{preferredResourceType}}}.
  Explain why you are suggesting each resource.

  Respond in the following format:
  {
    "suggestedResources": ["resource1", "resource2", ...],
    "reasoning": "Explanation of why these resources were suggested."
  }`,
});

const suggestLearningResourcesFlow = ai.defineFlow(
  {
    name: 'suggestLearningResourcesFlow',
    inputSchema: SuggestLearningResourcesInputSchema,
    outputSchema: SuggestLearningResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
