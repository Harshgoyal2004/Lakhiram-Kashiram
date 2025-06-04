
'use server';
/**
 * @fileOverview A Genkit flow to generate detailed product descriptions.
 *
 * - generateProductDescription - A function that generates a product description.
 * - GenerateProductDescriptionInput - The input type for the flow.
 * - GenerateProductDescriptionOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { SITE_NAME } from '@/lib/constants';

export const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  categoryName: z.string().describe('The category of the product.'),
  shortDescription: z.string().optional().describe('A short existing description if available.'),
  characteristics: z.array(z.string()).optional().describe('List of product characteristics.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

export const GenerateProductDescriptionOutputSchema = z.object({
  longDescription: z.string().describe('The detailed, AI-generated product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter for ${SITE_NAME}, a company specializing in high-quality oils, extracts, and Ayurvedic products. Your task is to generate a compelling and informative "longDescription" for our product detail page.

Product Name: {{{productName}}}
Category: {{{categoryName}}}
{{#if shortDescription}}Short Description: {{{shortDescription}}}{{/if}}
{{#if characteristics}}Characteristics: {{#each characteristics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Please generate a detailed long description. The description should be engaging and highlight:
1.  The essence and primary benefits of the product.
2.  Common uses and applications, especially considering its category (e.g., culinary for some spice oils, therapeutic for Ayurvedic oils, skincare for carrier oils).
3.  Unique selling points if inferable (e.g., purity, extraction method if typical for the product type, traditional significance).
4.  Mention our commitment to quality at ${SITE_NAME}.
5.  The tone should be professional, trustworthy, and appealing to customers seeking quality and natural products.
6.  Structure the description with paragraphs. Use HTML line breaks like "<br /><br />" for paragraph separation.
7.  If the category is "Ayurvedic Oil" or suggests therapeutic use, include a gentle reminder like: "While {{{productName}}} has been traditionally used for various wellness purposes, this information is not intended to diagnose, treat, cure, or prevent any disease. Please consult with a healthcare professional for specific health concerns."

Generate only the longDescription text.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    console.log('[generateProductDescriptionFlow] Input:', input);
    const {output} = await prompt(input);
    console.log('[generateProductDescriptionFlow] Output:', output);
    if (!output) {
      return { longDescription: `Failed to generate description for ${input.productName}. Please try again.` };
    }
    // Ensure output.longDescription is a string
    const description = typeof output.longDescription === 'string' ? output.longDescription : JSON.stringify(output.longDescription);
    return { longDescription: description };
  }
);
