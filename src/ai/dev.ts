'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quote.ts';
import '@/ai/flows/translate-and-chat.ts';
import '@/ai/flows/generate-image-from-prompt.ts';
import '@/ai/flows/suggest-learning-resources.ts';
import '@/ai/flows/find-eritrean-music.ts';
import '@/ai/flows/brain-teasers.ts';
import '@/ai/flows/generate-recipe.ts';
import '@/ai/flows/generate-workout.ts';
import '@/ai/flows/get-portfolio-data.ts';
