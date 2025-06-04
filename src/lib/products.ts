
// This file contains functions to fetch product data from Firestore
// for the informational company website.
'use server';

import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';

// Helper function to convert Firestore document to Product type
function docToProduct(documentSnapshot: any): Product {
  const data = documentSnapshot.data();
  return {
    id: documentSnapshot.id,
    name: data.name || '',
    description: data.description || '',
    longDescription: data.longDescription || '',
    imageUrl: data.imageUrl || 'https://placehold.co/600x400.png',
    dataAiHint: data.dataAiHint || (data.category ? data.category.toLowerCase().split(' ')[0] + ' oil' : 'oil bottle'),
    category: data.category || 'Uncategorized',
    characteristics: data.characteristics || [],
    usageTips: data.usageTips || '',
    origin: data.origin || '',
    packagingOptions: data.packagingOptions || [],
    isFeatured: data.isFeatured || false,
    attributes: data.attributes || [],
  };
}

// Helper function to generate a simple slug
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// Predefined list of product names for the "Essential | Spice Oil" category
const essentialSpiceOilProductNames: string[] = [
  "Anise oil", "Basil oil", "Bay leaf oil", "Bay oil", "Bergamot oil", 
  "Black pepper oil", "Boswellia serata oil", "Cajeput oil", "Calendula oil", 
  "RCO Calendula oil (Pure)", "Camellia oil", "Camphor oil", "Capsicum oil 2.5%", 
  "Capsicum oil 6.6%", "Capsicum oil 5%", "Caraway oil", "Cardamom oil 6000", 
  "Cardamom oil", "Carrot seed oil", "Cedarwood oil", "Chamomile oil", 
  "Chamomile oil- German blue", "Chamomile oil- Roman green", "Cinnamon oil", 
  "Cinnamon bark oil", "Cinnamon leaf oil", "Citronella oil", "Clary sage oil", 
  "Clove 85", "Clove bud oil", "Clove leaf oil", "Coriander oil", "Cumin oil", 
  "Curry leaf oil (Pure)", "Curry leaf oil (RCO)", "Cypress oil", "DIL seed oil", 
  "Eucalyptus oil 40%", "Eucalyptus oil 60%", "Eucalyptus oil 80%", "Fennel oil", 
  "Fenugreek oil", "FIR needle oil", "Frangipani oil", "Frankincense oil", 
  "Gandhpura oil", "Garlic oil (Pure)", "Garlic oil (RCO)", "Geranium", 
  "Geranium oil Egyptian Pure", "Geranium oil Egyptian RCO", "Ginger oil", 
  "Grape fruit oil", "Harsingar oil", "Helichrysum oil", "Hibiscus oil (RCO)", 
  "Hibiscus oil- Pure", "Holy basil oil", "Jasmine oil", "Juniper berry oil", 
  "Kapoor kachri oil", "Lavender oil", "Lavender oil Bulgarian", "Lemon Balm oil", 
  "Lily oil", "Lemon grass oil", "Lemon oil- Indian", "Lemon oil- Italian", 
  "Lemon oil- Bp", "Lemongrass oil natural 100%", "Litsea cubeba oil", 
  "Mandarin oil", "Marjoram oil", "Mint oil", "Myrrh oil", "MYRRH oil", 
  "Neroli oil (RCO)", "Niroli oil Pure 100% natural", "Nutmeg oil", "Oakmoss oil", 
  "Orange oil", "Oregano oil", "Palmrosa oil", "Patchouli oil", 
  "Patchouli oil (Dark)", "Petitgrain oil", "Peppermint oil", "Pine oil", 
  "Ravensara oil", "Rosemary oil", "Rose oil", "Sage oil", "Spearmint oil", 
  "Tea tree oil", "Tea tree oil- Pure", "Tea tree oil- Australian", "Thuja oil", 
  "Thyme oil", "Turmeric oil", "Turpentine oil", "Vanilla oil", 
  "Vetiver oil natural", "Vetiver oil RCO", "Wintergreen oil", "Yarrow oil", 
  "Ylang Ylang oil"
];

// Function to generate placeholder product data for the "Essential | Spice Oil" category
function getEssentialSpiceOilPlaceholders(): Product[] {
  return essentialSpiceOilProductNames.map((name, index) => {
    const nameParts = name.split(' ');
    // Create a hint from the first one or two words of the product name
    let hint = nameParts.slice(0, 2).join(' ').toLowerCase();
    if (nameParts.length === 1) hint = nameParts[0].toLowerCase();


    return {
      id: `${toSlug(name)}-${index}`, // Append index to ensure unique ID for similar names
      name: name,
      description: `High-quality ${name}. Experience the pure essence of ${name}, perfect for various applications.`,
      longDescription: `Detailed information about ${name}, its benefits, and uses will be provided here. This oil is known for its unique aroma and properties, making it a valuable addition to your collection.`,
      imageUrl: `https://placehold.co/600x400.png`,
      dataAiHint: hint,
      category: "Essential | Spice Oil",
      characteristics: ["Pure", "Natural"], // Generic characteristics
      usageTips: `Ideal for aromatherapy, culinary uses (if applicable for the specific oil), or personal care. Always consult guidelines for proper use and dilution of ${name}.`,
      origin: "Sourced from the finest natural ingredients.",
      packagingOptions: [{ size: "10ml bottle" }, { size: "30ml bottle" }, { size: "100ml bottle" }], // Generic packaging
      isFeatured: false,
      attributes: [{ key: "Type", value: "Essential/Spice Oil" }, {key: "Form", value: "Oil"}],
    };
  });
}


export async function getProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const querySnapshot = await getDocs(productsCollection);
    const products = querySnapshot.docs.map(docToProduct);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  // Check if the ID might belong to a hardcoded "Essential | Spice Oil" product
  const essentialOils = getEssentialSpiceOilPlaceholders();
  const hardcodedProduct = essentialOils.find(p => p.id === id);
  if (hardcodedProduct) {
    return hardcodedProduct;
  }

  // If not found in hardcoded list, try fetching from Firestore
  try {
    const productDocRef = doc(db, 'products', id);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      return docToProduct(productDoc);
    } else {
      console.log("No such product document in Firestore!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

export async function getFeaturedProducts(count: number = 3): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where("isFeatured", "==", true), limit(count));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docToProduct);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getProductsByCategoryName(categoryName: string): Promise<Product[]> {
  // Check if the category is "Essential | Spice Oil"
  if (categoryName === "Essential | Spice Oil") {
    // NOTE: The data for "Essential | Spice Oil" category is currently hardcoded below
    // for demonstration purposes. For a production application, this data should ideally
    // be managed in Firestore, similar to other product categories.
    return getEssentialSpiceOilPlaceholders();
  }

  // For other categories, fetch from Firestore
  try {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where("category", "==", categoryName));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(docToProduct);
    return products;
  } catch (error) {
    console.error(`Error fetching products for category "${categoryName}":`, error);
    return [];
  }
}
