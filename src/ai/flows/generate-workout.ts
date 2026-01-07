'use server';

/**
 * @fileOverview A flow for generating personalized workout plans.
 *
 * - generateWorkout - A function that generates a workout plan.
 * - GenerateWorkoutInput - The input type for the generateWorkout function.
 * - GenerateWorkoutOutput - The return type for the generateWorkout function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateWorkoutInputSchema = z.object({
  goal: z.enum(['weight loss', 'muscle gain', 'strength', 'beginner fitness', 'endurance']).describe('The primary fitness goal.'),
  workoutType: z.enum(['Gym', 'Home', 'Outdoor']).describe('The location or type of workout.'),
  difficulty: z.enum(['Easy', 'Medium', 'Advanced']).describe('The difficulty level of the workout.'),
  sessionTime: z.number().min(15).max(120).describe('The desired session time in minutes.'),
  focus: z.string().optional().describe('Specific body-part to focus on (e.g., abs, chest, legs).'),
  equipment: z.string().optional().describe('Available equipment (e.g., dumbbells, body-weight).'),
});
export type GenerateWorkoutInput = z.infer<typeof GenerateWorkoutInputSchema>;

const ExerciseSchema = z.object({
    name: z.string().describe('The name of the exercise.'),
    sets: z.string().describe('The number of sets (e.g., "3" or "3-4").'),
    reps: z.string().describe('The number of repetitions (e.g., "10-12" or "to failure").'),
    rest: z.string().describe('The rest time between sets in seconds or minutes (e.g., "60s" or "2 mins").'),
});

const GenerateWorkoutOutputSchema = z.object({
  planTitle: z.string().describe("A catchy title for the workout plan."),
  goal: z.string().describe("The primary goal of this workout plan."),
  workoutType: z.string().describe("The type of workout (Gym, Home, Outdoor)."),
  difficulty: z.string().describe("The difficulty level."),
  sessionTime: z.string().describe("The estimated duration of the session."),
  warmUp: z.array(z.string()).describe("A list of warm-up exercises."),
  mainWorkout: z.array(ExerciseSchema).describe("A list of main workout exercises with sets, reps, and rest times."),
  coolDown: z.array(z.string()).describe("A list of cool-down and stretching exercises."),
  safetyTips: z.string().describe("Important safety tips and proper form guidance."),
  caloriesEstimate: z.string().optional().describe("An optional estimate of calories burned."),
});
export type GenerateWorkoutOutput = z.infer<typeof GenerateWorkoutOutputSchema>;

export async function generateWorkout(input: GenerateWorkoutInput): Promise<GenerateWorkoutOutput> {
  return generateWorkoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPrompt',
  input: { schema: GenerateWorkoutInputSchema },
  output: { schema: GenerateWorkoutOutputSchema },
  prompt: `Act as a smart Gym & Fitness AI Coach. Generate personalized workout plans, exercise guides, and fitness recommendations based on the user’s goals, experience level, and available equipment.

User preferences:
- Goal: {{{goal}}}
- Workout Type: {{{workoutType}}}
- Difficulty Level: {{{difficulty}}}
- Session Time: {{{sessionTime}}} minutes
{{#if focus}}- Body-part focus: {{{focus}}}{{/if}}
{{#if equipment}}- Available equipment: {{{equipment}}}{{/if}}

For every workout plan, include:
- A creative 'planTitle'.
- The user's specified 'goal', 'workoutType', 'difficulty', and 'sessionTime'.
- 'warmUp': A list of warm-up exercises.
- 'mainWorkout': An array of exercises, each with 'name', 'sets', 'reps', and 'rest' time.
- 'coolDown': A list of cool-down & stretching exercises.
- 'safetyTips': Important safety tips & proper form guidance.
- 'caloriesEstimate': An estimate of calories burned, if possible.

Support body-part focused workouts, various equipment options, and both gym and home-friendly routines.
Include recommendations for recovery and hydration within the safety tips.
Provide clear, simple instructions that anyone can follow.`,
});


const generateWorkoutFlow = ai.defineFlow(
  {
    name: 'generateWorkoutFlow',
    inputSchema: GenerateWorkoutInputSchema,
    outputSchema: GenerateWorkoutOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
