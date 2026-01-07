'use server';

/**
 * @fileOverview Image generation flow from a text prompt in Tigrinya or Saho.
 *
 * - generateImageFromPrompt - A function that generates an image based on the provided text prompt.
 * - GenerateImageFromPromptInput - The input type for the generateImageFromPrompt function.
 * - GenerateImageFromPromptOutput - The return type for the generateImageFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe('The text prompt to generate the image from, in Tigrinya or Saho.'),
});
export type GenerateImageFromPromptInput = z.infer<typeof GenerateImageFromPromptInputSchema>;

const GenerateImageFromPromptOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageFromPromptOutput = z.infer<typeof GenerateImageFromPromptOutputSchema>;

export async function generateImageFromPrompt(input: GenerateImageFromPromptInput): Promise<GenerateImageFromPromptOutput> {
  return generateImageFromPromptFlow(input);
}

const generateImageFromPromptFlow = ai.defineFlow(
  {
    name: 'generateImageFromPromptFlow',
    inputSchema: GenerateImageFromPromptInputSchema,
    outputSchema: GenerateImageFromPromptOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });

    if (!media) {
      throw new Error('No image was generated.');
    }

    return {imageUrl: media.url};
  }
);
