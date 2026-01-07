'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-image-from-prompt.ts';
import '@/ai/flows/suggest-learning-resources.ts';
import '@/ai/flows/summarize-webpage-content.ts';
import '@/ai/flows/translate-and-chat.ts';
import '@/ai/flows/find-eritrean-music.ts';
