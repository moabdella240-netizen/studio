'use server';

/**
 * @fileOverview A flow for generating brain teasers, trick questions, and lifehacks.
 *
 * - generateBrainTeasers - A function that generates the content.
 * - GenerateBrainTeasersInput - The input type for the generateBrainTeasers function.
 * - GenerateBrainTeasersOutput - The return type for the generateBrainTeasers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBrainTeasersInputSchema = z.object({
  language: z.string().describe('The language for the generated content (e.g., English, Tigrinya).'),
});
export type GenerateBrainTeasersInput = z.infer<typeof GenerateBrainTeasersInputSchema>;

const FootballQuestionSchema = z.object({
  question: z.string().describe('A clever and challenging question about football rules, players, or matches.'),
  answer: z.string().describe('The answer to the football question.'),
});

const LifeQuestionSchema = z.object({
  question: z.string().describe('A mind-bending riddle or logic puzzle about daily life.'),
  answer: z.string().describe('The answer to the life question.'),
});

const LifehackSchema = z.object({
  title: z.string().describe('The title of the lifehack.'),
  description: z.string().describe('A brief description or step-by-step instructions for the lifehack.'),
});

const GenerateBrainTeasersOutputSchema = z.object({
  footballTrickQuestions: z.array(FootballQuestionSchema).describe('A list of 1-3 football trick questions.'),
  lifeTrickQuestions: z.array(LifeQuestionSchema).describe('A list of 1-3 mind-bending riddles and logic puzzles.'),
  lifehacks: z.array(LifehackSchema).describe('A list of 1-3 practical lifehacks for everyday tasks.'),
});
export type GenerateBrainTeasersOutput = z.infer<typeof GenerateBrainTeasersOutputSchema>;


export async function generateBrainTeasers(input: GenerateBrainTeasersInput): Promise<GenerateBrainTeasersOutput> {
  return generateBrainTeasersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrainTeasersPrompt',
  input: { schema: GenerateBrainTeasersInputSchema },
  output: { schema: GenerateBrainTeasersOutputSchema },
  prompt: `You are an AI that generates engaging and fun content in {{language}}. Generate 1-3 entries for each of the following categories:

1.  **Football Trick Questions**: Create clever and challenging questions about football (soccer) rules, famous players, or iconic matches. Provide a question and a concise answer.
2.  **Life Trick Questions**: Create mind-bending riddles and logic puzzles about everyday situations, logic, or human behavior. Provide the question and the answer.
3.  **Lifehacks**: Provide practical and useful tips for everyday tasks, learning, productivity, or health. Give each hack a title and a simple step-by-step description.

All content should be culturally neutral and easy to understand. Ensure the variety and randomization of the entries to keep it interesting.
`,
});


const generateBrainTeasersFlow = ai.defineFlow(
  {
    name: 'generateBrainTeasersFlow',
    inputSchema: GenerateBrainTeasersInputSchema,
    outputSchema: GenerateBrainTeasersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
