'use server';

/**
 * @fileOverview A flow for answering user questions on a variety of topics.
 *
 * - answerGeneralQuestion - A function that answers a user's question.
 * - AnswerGeneralQuestionInput - The input type for the answerGeneralQuestion function.
 * - AnswerGeneralQuestionOutput - The return type for the answerGeneralQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerGeneralQuestionInputSchema = z.object({
  question: z.string().describe('The user\'s question.'),
  language: z.enum(['Tigrinya', 'English', 'Arabic']).describe('The language for the answer.'),
});
export type AnswerGeneralQuestionInput = z.infer<typeof AnswerGeneralQuestionInputSchema>;

const AnswerGeneralQuestionOutputSchema = z.object({
  answer: z.string().describe('A helpful and accurate answer to the user\'s question.'),
});
export type AnswerGeneralQuestionOutput = z.infer<typeof AnswerGeneralQuestionOutputSchema>;

export async function answerGeneralQuestion(input: AnswerGeneralQuestionInput): Promise<AnswerGeneralQuestionOutput> {
  return answerGeneralQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerGeneralQuestionPrompt',
  input: { schema: AnswerGeneralQuestionInputSchema },
  output: { schema: AnswerGeneralQuestionOutputSchema },
  prompt: `You are an intelligent and helpful Q&A assistant. Your goal is to provide clear, accurate, and concise answers to user questions.

Please answer the following question in {{language}}.

Question: {{{question}}}
`,
});

const answerGeneralQuestionFlow = ai.defineFlow(
  {
    name: 'answerGeneralQuestionFlow',
    inputSchema: AnswerGeneralQuestionInputSchema,
    outputSchema: AnswerGeneralQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
