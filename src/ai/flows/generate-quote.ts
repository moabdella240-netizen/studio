'use server';

/**
 * @fileOverview A flow for generating quotes and answering user questions.
 *
 * - generateQuote - Generates a quote with an explanation.
 * - answerQuestion - Answers a user's question.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for generating a quote
const GenerateQuoteInputSchema = z.object({
  language: z.enum(['Tigrinya', 'English']).describe('The language for the quote.'),
  topic: z.string().optional().describe('An optional topic for the quote (e.g., motivation, life, humor).'),
});
export type GenerateQuoteInput = z.infer<typeof GenerateQuoteInputSchema>;

const GenerateQuoteOutputSchema = z.object({
  quote: z.string().describe('The generated quote.'),
  explanation: z.string().describe('A short, insightful explanation of the quote.'),
});
export type GenerateQuoteOutput = z.infer<typeof GenerateQuoteOutputSchema>;

export async function generateQuote(input: GenerateQuoteInput): Promise<GenerateQuoteOutput> {
    return generateQuoteFlow(input);
}

const generateQuotePrompt = ai.definePrompt({
    name: 'generateQuotePrompt',
    input: { schema: GenerateQuoteInputSchema },
    output: { schema: GenerateQuoteOutputSchema },
    prompt: `You are an AI that provides inspiring and insightful quotes.
Generate a {{#if topic}}{{{topic}}}{{else}}random{{/if}} quote in {{language}}.
The quote can be motivational, inspirational, funny, or life-related.
Also provide a short, insightful explanation or lesson related to the quote.
`,
});

const generateQuoteFlow = ai.defineFlow(
    {
        name: 'generateQuoteFlow',
        inputSchema: GenerateQuoteInputSchema,
        outputSchema: GenerateQuoteOutputSchema,
    },
    async (input) => {
        const { output } = await generateQuotePrompt(input);
        return output!;
    }
);


// Schema for answering a question
const AnswerQuestionInputSchema = z.object({
    language: z.enum(['Tigrinya', 'English']).describe('The language for the answer.'),
    question: z.string().describe('The user\'s question.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
    answer: z.string().describe('A clear, concise, and helpful AI answer.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
    return answerQuestionFlow(input);
}

const answerQuestionPrompt = ai.definePrompt({
    name: 'answerQuestionPrompt',
    input: { schema: AnswerQuestionInputSchema },
    output: { schema: AnswerQuestionOutputSchema },
    prompt: `You are a helpful AI assistant. Answer the following question clearly and concisely in {{language}}.
Question: {{{question}}}
`,
});

const answerQuestionFlow = ai.defineFlow(
    {
        name: 'answerQuestionFlow',
        inputSchema: AnswerQuestionInputSchema,
        outputSchema: AnswerQuestionOutputSchema,
    },
    async (input) => {
        const { output } = await answerQuestionPrompt(input);
        return output!;
    }
);
