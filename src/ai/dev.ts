
import { config } from 'dotenv';
config();

// Removed imports for oil-recommendation.ts and enhanced-oil-descriptions.ts
// If new, non-e-commerce AI flows are added, import them here.
// Import for generate-product-description-flow.ts has been removed.


// Ensure this file is not empty if genkit dev script still runs
// Adding a console log to indicate it's running if no flows are present
if (require.main === module) {
  console.log("Genkit dev server started. No AI product description flow imported.");
}
