// enhanced-oil-descriptions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating enhanced cooking oil descriptions that include relevant historical references and origin information.
 *
 * - getEnhancedOilDescription - A function that takes an oil name as input and returns an enhanced description.
 * - EnhancedOilDescriptionInput - The input type for the getEnhancedOilDescription function.
 * - EnhancedOilDescriptionOutput - The return type for the getEnhancedOilDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancedOilDescriptionInputSchema = z.object({
  oilName: z.string().describe('The name of the cooking oil.'),
});
export type EnhancedOilDescriptionInput = z.infer<typeof EnhancedOilDescriptionInputSchema>;

const EnhancedOilDescriptionOutputSchema = z.object({
  enhancedDescription: z.string().describe('An enhanced description of the cooking oil, including relevant historical references and origin information.'),
});
export type EnhancedOilDescriptionOutput = z.infer<typeof EnhancedOilDescriptionOutputSchema>;

export async function getEnhancedOilDescription(input: EnhancedOilDescriptionInput): Promise<EnhancedOilDescriptionOutput> {
  return enhancedOilDescriptionFlow(input);
}

const fetchOilDetails = ai.defineTool(
  {
    name: 'fetchOilDetails',
    description: 'Retrieves detailed information about a specific cooking oil from a product database.',
    inputSchema: z.object({
      oilName: z.string().describe('The name of the cooking oil to retrieve details for.'),
    }),
    outputSchema: z.object({
      origin: z.string().describe('The geographical origin of the oil.'),
      historicalReferences: z.string().describe('Notable historical uses or mentions of the oil.'),
      productionMethods: z.string().describe('Details on how the oil is produced.'),
    }),
  },
  async input => {
    // TODO: Implement the actual data retrieval logic here.
    // This is a placeholder implementation.
    return {
      origin: `The origin of ${input.oilName} is unknown.`,
      historicalReferences: `There are no historical references for ${input.oilName}.`,
      productionMethods: `The production methods for ${input.oilName} are not documented.`, 
    };
  }
);

const prompt = ai.definePrompt({
  name: 'enhancedOilDescriptionPrompt',
  input: {schema: EnhancedOilDescriptionInputSchema},
  output: {schema: EnhancedOilDescriptionOutputSchema},
  tools: [fetchOilDetails],
  prompt: `You are an expert in cooking oils, providing detailed and engaging descriptions for customers.

  Based on the cooking oil name provided by the user, use the fetchOilDetails tool to get information about the oil's origin, historical references, and production methods.

  Then create an enhanced description of the oil, incorporating the information retrieved from the tool. The description should be informative and enticing, helping customers learn more about the product and make informed purchasing decisions.

  Oil Name: {{{oilName}}}
  Enhanced Description: `,
});

const enhancedOilDescriptionFlow = ai.defineFlow(
  {
    name: 'enhancedOilDescriptionFlow',
    inputSchema: EnhancedOilDescriptionInputSchema,
    outputSchema: EnhancedOilDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
