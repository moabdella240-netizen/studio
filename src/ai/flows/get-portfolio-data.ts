'use server';

/**
 * @fileOverview A flow for retrieving portfolio data.
 *
 * - getPortfolioData - A function that returns static portfolio information.
 * - PortfolioData - The return type for the getPortfolioData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
});

const ExperienceSchema = z.object({
  role: z.string(),
  description: z.string(),
});

const PortfolioDataSchema = z.object({
  name: z.string(),
  about: z.string(),
  skills: z.array(SkillSchema),
  experience: z.array(ExperienceSchema),
  languages: z.array(z.string()),
  contact: z.object({
    facebook: z.string().url(),
  }),
});

export type PortfolioData = z.infer<typeof PortfolioDataSchema>;

export async function getPortfolioData(): Promise<PortfolioData> {
  return getPortfolioDataFlow();
}

const getPortfolioDataFlow = ai.defineFlow(
  {
    name: 'getPortfolioDataFlow',
    outputSchema: PortfolioDataSchema,
  },
  async () => {
    return {
      name: 'Abdella Mohammed Ali',
      about: 'I am a passionate programmer and app builder with experience in creating practical and user-friendly applications. I enjoy turning ideas into functional digital solutions and continuously learning new technologies to improve my skills. I am dedicated, detail-oriented, and always strive to deliver high-quality work.',
      skills: [
        { category: 'Programming', skills: ['App Development', 'Problem-Solving', 'Technology Integration'] },
      ],
      experience: [
        {
          role: 'App Builder',
          description: 'Developed and built applications from concept to deployment, focusing on functionality, user experience, and performance. Successfully managed projects independently, ensuring timely delivery and effective solutions.',
        },
      ],
      languages: ['Saho - Fluent', 'English - Fluent', 'Arabic - Fluent', 'Tigrinya - Fluent'],
      contact: {
        facebook: 'https://www.facebook.com/share/1AsKNNfYpH/',
      },
    };
  }
);
