'use server';

/**
 * @fileOverview Implements a multilingual AI chat flow that translates English input to Tigrinya or Saho and responds accordingly.
 *
 * - translateAndChat - A function that takes English input and responds in the specified target language (Tigrinya or Saho).
 * - TranslateAndChatInput - The input type for the translateAndChat function, including the English message and target language.
 * - TranslateAndChatOutput - The return type for the translateAndChat function, providing the AI's response in the target language.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateAndChatInputSchema = z.object({
  message: z.string().describe('The English message to be translated and responded to.'),
  targetLanguage: z.enum(['Tigrinya', 'Saho']).describe('The target language for the AI response.'),
});
export type TranslateAndChatInput = z.infer<typeof TranslateAndChatInputSchema>;

const TranslateAndChatOutputSchema = z.object({
  response: z.string().describe('The AI response in the target language.'),
});
export type TranslateAndChatOutput = z.infer<typeof TranslateAndChatOutputSchema>;

export async function translateAndChat(input: TranslateAndChatInput): Promise<TranslateAndChatOutput> {
  return translateAndChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateAndChatPrompt',
  input: {schema: TranslateAndChatInputSchema},
  output: {schema: TranslateAndChatOutputSchema},
  prompt: `You are a multilingual AI assistant. The user will send you a message in English, and you will respond in {{targetLanguage}}.  Respond in a way that is natural and helpful.  Here is the user's message:

{{message}}`,
});

const translateAndChatFlow = ai.defineFlow(
  {
    name: 'translateAndChatFlow',
    inputSchema: TranslateAndChatInputSchema,
    outputSchema: TranslateAndChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
