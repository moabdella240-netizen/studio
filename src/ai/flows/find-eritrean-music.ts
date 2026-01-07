'use server';

/**
 * @fileOverview A flow for finding Eritrean music based on user preferences.
 *
 * - findEritreanMusic - A function that finds music.
 * - FindEritreanMusicInput - The input type for the findEritreanMusic function.
 * - FindEritreanMusicOutput - The return type for the findEritreanMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindEritreanMusicInputSchema = z.object({
  artist: z.string().optional().describe('The artist the user is interested in.'),
  genre: z.string().optional().describe('The genre of music the user likes.'),
  language: z
    .enum(['Tigrinya', 'Tigre', 'Any'])
    .optional()
    .describe('The language of the music.'),
  mood: z.string().optional().describe('The mood for the music (e.g., upbeat, relaxing, traditional).'),
});
export type FindEritreanMusicInput = z.infer<typeof FindEritreanMusicInputSchema>;

const SongSuggestionSchema = z.object({
    songTitle: z.string().describe('The title of the song.'),
    artist: z.string().describe('The name of the artist.'),
    album: z.string().describe('The album the song is from.'),
    youtubeUrl: z.string().url().describe('A YouTube URL to listen to the song.'),
    reason: z.string().describe('A brief reason why this song is recommended based on the user\'s input.'),
});

const FindEritreanMusicOutputSchema = z.object({
  playlistTitle: z.string().describe('A creative title for the generated playlist.'),
  suggestions: z
    .array(SongSuggestionSchema)
    .describe('A list of 3-5 Eritrean song suggestions.'),
});
export type FindEritreanMusicOutput = z.infer<typeof FindEritreanMusicOutputSchema>;

export async function findEritreanMusic(
  input: FindEritreanMusicInput
): Promise<FindEritreanMusicOutput> {
  return findEritreanMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findEritreanMusicPrompt',
  input: {schema: FindEritreanMusicInputSchema},
  output: {schema: FindEritreanMusicOutputSchema},
  prompt: `You are an expert on Eritrean music. Generate a curated list of 3-5 Eritrean music tracks for a user.

The user's preferences are:
{{#if artist}}Artist: {{{artist}}}{{/if}}
{{#if genre}}Genre: {{{genre}}}{{/if}}
{{#if language}}Language: {{{language}}}{{/if}}
{{#if mood}}Mood: {{{mood}}}{{/if}}

For each suggestion, provide the song title, artist, album, a valid YouTube link to listen to the song, and a brief reason for the recommendation. If you can't find a specific detail, you can use "N/A". Ensure all links are valid URLs.

Create a creative title for this playlist.
`,
});

const findEritreanMusicFlow = ai.defineFlow(
  {
    name: 'findEritreanMusicFlow',
    inputSchema: FindEritreanMusicInputSchema,
    outputSchema: FindEritreanMusicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
