'use server';

/**
 * @fileOverview A flow for generating a cinematic homepage video.
 *
 * - generateHomepageVideo - A function that generates the video.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

export const GenerateHomepageVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateHomepageVideoOutput = z.infer<typeof GenerateHomepageVideoOutputSchema>;

export async function generateHomepageVideo(): Promise<GenerateHomepageVideoOutput> {
  return generateHomepageVideoFlow();
}

const generateHomepageVideoFlow = ai.defineFlow(
  {
    name: 'generateHomepageVideoFlow',
    outputSchema: GenerateHomepageVideoOutputSchema,
  },
  async () => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-3.0-generate-preview'),
      prompt: `A 20-second cinematic video for a premium mobile app homepage. The video should feel powerful, futuristic, and visually captivating, instantly grabbing attention. Use a vibrant color palette inspired by the Eritrean flag: red, green, and blue, with subtle gold accents. Include dynamic abstract tech visuals, glowing light effects, and smooth motion graphics that convey innovation, intelligence, and user engagement. Blend subtle cultural motifs (Eritrean patterns, symbols, or textures) into the background animations. Include smooth transitions, cinematic camera movements, and energy-filled abstract sequences, emphasizing speed, connectivity, and app sophistication. Optimize for web and mobile, high-resolution, visually stunning, with impact in the first 3 seconds.`,
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
    }
    
    if (operation.error) {
        throw new Error('failed to generate video: ' + operation.error.message);
    }
    
    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video || !video.media) {
        throw new Error('Failed to find the generated video');
    }

    return { videoUrl: video.media.url };
  }
);
