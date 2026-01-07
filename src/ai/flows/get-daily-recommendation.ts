'use server';

/**
 * @fileOverview A flow for generating personalized daily recommendations.
 *
 * - getDailyRecommendation - A function that returns a daily recommendation object.
 * - DailyRecommendation - The return type for the getDailyRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuoteSchema = z.object({
  text: z.string().describe("An inspiring or motivational quote, concise and easy to remember."),
  author: z.string().describe("Include the author if known, or 'Unknown'."),
});

const RiddleSchema = z.object({
  question: z.string().describe("A fun and challenging riddle suitable for teens and adults."),
  answer: z.string().describe("The answer to the riddle."),
});

const SongSchema = z.object({
  title: z.string().describe("Name a popular Eritrean song."),
  artist: z.string().describe("Provide the singer or band name."),
  description: z.string().describe("Include a short description, fact, or context about the song."),
});

const LearningTipSchema = z.object({
  tip: z.string().describe("A practical and actionable tip for learning, productivity, or personal growth."),
});

const DailyRecommendationOutputSchema = z.object({
  quote_of_the_day: QuoteSchema,
  riddle_of_the_day: RiddleSchema,
  popular_eritrean_song: SongSchema,
  learning_tip: LearningTipSchema,
});

export type DailyRecommendation = z.infer<typeof DailyRecommendationOutputSchema>;

const DailyRecommendationInputSchema = z.object({
  language: z.enum(['Tigrinya', 'English', 'Arabic']).optional().describe('The language for the recommendation content.'),
});

export type DailyRecommendationInput = z.infer<typeof DailyRecommendationInputSchema>;


export async function getDailyRecommendation(input?: DailyRecommendationInput): Promise<DailyRecommendation> {
  return getDailyRecommendationFlow(input || {});
}

const prompt = ai.definePrompt({
  name: 'getDailyRecommendationPrompt',
  input: { schema: DailyRecommendationInputSchema },
  output: { schema: DailyRecommendationOutputSchema },
  prompt: `Generate a personalized daily recommendation in the specified JSON format. All content should be engaging, culturally relevant where possible, and concise. Each field must be filled.

  The content should be in {{language}}.
  `,
});

const getDailyRecommendationFlow = ai.defineFlow(
  {
    name: 'getDailyRecommendationFlow',
    inputSchema: DailyRecommendationInputSchema,
    outputSchema: DailyRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({language: input.language || 'English'});
    return output!;
  }
);
