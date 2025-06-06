
// This file contains functions to fetch product data from Firestore
// for the informational company website.
'use server';

import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import { SITE_NAME } from '@/lib/constants';

// Placeholder for products that need a description.
const STATIC_DESCRIPTION_PLACEHOLDER_TEMPLATE = (productName: string, categoryName: string): string => `
Discover the quality and purity of ${productName} from ${SITE_NAME}.
<br /><br />
As a leading name in the ${categoryName} category, we ensure that ${productName} meets the highest standards. Our commitment to excellence means you receive a product that is authentic and reliable.
<br /><br />
**Key Benefits & Uses:**
(Details about typical uses and benefits for this type of product will be added here. e.g., culinary uses, therapeutic properties, suitability for different applications, etc.)
<br /><br />
**Why Choose ${SITE_NAME}?**
At ${SITE_NAME}, we pride ourselves on our heritage and expertise in sourcing and providing the finest oils and extracts. Our rigorous quality control processes guarantee that you receive only the best.
<br /><br />
${categoryName.toLowerCase().includes('ayurvedic') || categoryName.toLowerCase().includes('essential') ? `While ${productName} has been traditionally used for various wellness purposes, this information is not intended to diagnose, treat, cure, or prevent any disease. Please consult with a healthcare professional for specific health concerns.` : ''}
`;


// Helper function to convert Firestore document to Product type
function docToProduct(documentSnapshot: any): Product {
  const data = documentSnapshot.data();
  return {
    id: documentSnapshot.id,
    name: data.name || '',
    description: data.description || '',
    longDescription: data.longDescription || STATIC_DESCRIPTION_PLACEHOLDER_TEMPLATE(data.name || 'this product', data.category || 'our products'),
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
  "Neroli oil (RCO)", "Niroli oil Pure 100% natural", "Nutmeg oil",
  "Oakmoss oil", "Orange oil", "Oregano oil", "Palmrosa oil", "Patchouli oil",
  "Patchouli oil (Dark)", "Petitgrain oil", "Peppermint oil", "Pine oil",
  "Ravensara oil", "Rosemary oil", "Rose oil", "Sage oil", "Spearmint oil",
  "Tea tree oil", "Tea tree oil- Pure", "Tea tree oil- Australian", "Thuja oil",
  "Thyme oil", "Turmeric oil", "Turpentine oil", "Vanilla oil",
  "Vetiver oil natural", "Vetiver oil RCO", "Wintergreen oil", "Yarrow oil",
  "Ylang Ylang oil"
];

// Predefined list of product names for the "Range of Carrier Oil" category
const rangeOfCarrierOilProductNames: string[] = [
    "Almond oil", "Apricot oil", "Arachis oil", "Argan oil (Indian)", "Argan oil (Moroccan)",
    "Arnica oil", "Avocado oil", "Bakuchi oil", "Birch oil", "Bitter guard oil",
    "Black cumin seed oil", "Black current seed oil", "Borage oil", "Cashew nut oil", "Castor oil",
    "Chaulmogra oil", "Chai seed oil", "Coconut oil (Virgin)", "Coconut oil (Refined)", "Corn oil",
    "Cotton seed oil", "Cranberry oil", "Cucumber seed oil", "Evening prime rose oil", "Flaxseed oil",
    "Ginseng oil", "Grape seed oil (Yellow)", "Grape seed oil (Green)", "Gunja seed oil", "Ground nut oil",
    "Hazel nut oil", "Hemp seed oil", "Jojoba oil (Golden)", "Kalonji oil", "Karanja oil",
    "Kiwi seed oil", "Macadamia nut oil (Red)", "Macadamia nut oil (Pale yellow)", "Malkangani oil", "Moringa oil",
    "Musk melon oil", "Neem oil", "Noni oil", "Olive oil – Virgin", "Olive oil (Pomace)",
    "Olive oil (Extra virgin)", "Palm oil", "Papaya seed oil", "Peach seed oil", "Peanut oil",
    "Pistachio oil", "Pomegranate oil", "Prickly pear oil", "Pumpkin seed oil", "Raspberry oil",
    "Roship oil- Refined", "Roship oil- Virgin", "Safflower oil", "Saw palmetto oil", "Seabuckthorn seed oil",
    "Seabuckthorn berry oil", "Sesame oil", "Soybean oil", "Sunflower oil", "Walnut oil", "Wheatgerm oil"
];

// Predefined list of product names for the "Extract | Soluble Oil" category
const extractSolubleOilProductNames: string[] = [
  "Ajmoda", "Ajwain", "Akarkara", "Akhrot", "Almond", "Amar bel", "Amla", "Anar (Dadam chhal)",
  "Angeer", "Anise", "Arand", "Arnica", "Ashwagandha", "Avocado", "Babchi", "Babul chhal",
  "Babuna", "Bael fruit", "Bahada", "Bargat", "Bichchhu buti", "Brahmi", "Chameli", "Chandan",
  "Chirongi", "Coleus", "Dalchini", "Dasmool", "Datura", "Devdar", "Dhai phool", "Dill seed",
  "Durva", "Elachi", "Gajar", "Gambhari", "Gandhpurna", "Ghrit Kumari (Aloe Vera)", "Giloy",
  "Ginko", "Golden ROD", "Grapes", "Gulab", "Gunja", "Harad", "Hazel nut", "Horse Tail",
  "Indrayain", "Jaiphal", "Jamun", "Jata manshi", "Jojoba", "Kali mirchi", "Kamal", "Kapoor",
  "Kapur Kachri", "Karanj beej", "Khal muriya", "Khus", "Kuchla", "Lagwanti", "Lauki", "Lehsun",
  "Lemon", "Lemon grass", "Lodhra", "Lotus", "Loung", "Malkhagni", "Manjishtha", "Mehndi",
  "Mentha", "Meshwak (Pilu)", "Mehti", "Mogra", "Mulethi", "Nagarmotha", "Neelgiri",
  "Nirgundi", "Noni", "Olive oil", "Orange", "Palas papra", "Rtanjot", "Rose hip", "Rose marry",
  "Saffron", "Salai guggal", "Sank puspi", "Satawari", "Saunf", "Seabuckthorn", "Sena",
  "Shalparni", "Shikakai", "Sonth", "Spearmint", "Tea tree", "Trikatu", "Triphala",
  "True Indigo", "Tulsi", "Turmeric", "Vativer"
];

// Predefined list of product names for the "PG | Water Extract" category
const pgWaterExtractProductNames: string[] = [
  "Akarkara", "Almond", "Aloe vera", "Amla", "Ananas", "Anantmool", "Anar", "Anjeer", "Apple", "Arjuna", "Arnica", "Ashwagandha", "Avocado",
  "Babchi", "Baboona", "Baheda", "Banana", "Beal fruit", "Bhringraj", "Bhui amla", "Black berry", "Blue berry", "Brahmi", "Chameli", "Chironji", "Coffea",
  "Dalchini", "Dandelion", "Daru haldi", "Dhai phool", "Dudhi", "Gajar", "Gendha", "Giloy", "Ginseng", "Grapes", "Green tea", "Harad", "Honey", "Imli",
  "Jaiphal", "Jamun", "Jatamansi", "Kalmegh", "Kali mirch", "Kapur", "Kansi", "Kelp Sea", "Kesar", "Kheera", "Khus", "Kiwi",
  "Lemon", "Lehsun", "Lodhra", "Lotus", "Manjistha", "Marshmello", "Methi", "Mehndi", "Mentha", "Mix fruit", "Mogra", "Mulethi", "Mulberry", "Mushroom",
  "Nagarmotha", "Nariyal", "Neel giri", "Neem", "Neem tulsi", "Nirgundi", "Oats", "Olive", "Onion", "Orange", "Papita", "Peach",
  "Punarnava", "Reetha", "Rose", "Rosemary", "Sandal", "Saw Palmtto", "Senna", "Shank puspi", "Shikakai", "Sounf", "Satavari", "Strawberry", "Sunflower",
  "Sunthi", "Supari", "Tea tree", "Thyme", "Tulsi", "Turmeric", "Vacha", "Vaividang", "Vanchlochan", "Vashak", "Vidarikand", "Wheat", "Witch Hazel"
];

// Predefined list of product names for the "Ayurvedic Oil" category
const ayurvedicOilProductNames: string[] = [
  "Akarkara", "Almond", "Aloe vera", "Amla", "Ananas", "Anantmool", "Anar", "Anjeer", "Apple", "Arjuna", "Arnica", "Ashwagandha", "Avocado",
  "Babchi", "Baboona", "Baheda", "Banana", "Beal fruit", "Bhringraj", "Bhui amla", "Black berry", "Blue berry", "Brahmi", "Chameli", "Chironji", "Coffea",
  "Dalchini", "Dandelion", "Daru haldi", "Dhai phool", "Dudhi", "Gajar", "Gendha", "Giloy", "Ginseng", "Grapes", "Green tea", "Harad", "Honey", "Imli",
  "Jaiphal", "Jamun", "Jatamansi", "Kalmegh", "Kali mirch", "Kapur", "Kansi", "Kelp Sea", "Kesar", "Kheera", "Khus", "Kiwi",
  "Lemon", "Lehsun", "Lodhra", "Lotus", "Manjistha", "Marshmello", "Methi", "Mehndi", "Mentha", "Mix fruit", "Mogra", "Mulethi", "Mulberry", "Mushroom",
  "Nagarmotha", "Nariyal", "Neel giri", "Neem", "Neem tulsi", "Nirgundi", "Oats", "Olive", "Onion", "Orange", "Papita", "Peach",
  "Punarnava", "Reetha", "Rose", "Rosemary", "Sandal", "Saw Palmtto", "Senna", "Shank puspi", "Shikakai", "Sounf", "Satavari", "Strawberry", "Sunflower",
  "Sunthi", "Supari", "Tea tree", "Thyme", "Tulsi", "Turmeric", "Vacha", "Vaividang", "Vanchlochan", "Vashak", "Vidarikand", "Wheat", "Witch Hazel"
];


// Function to generate placeholder product data
function generatePlaceholderProducts(productNames: string[], category: string): Product[] {
  const categoryType = category.toLowerCase().includes('extract') ? 'extract' : (category.toLowerCase().includes('ayurvedic') ? 'ayurvedic product' : 'oil');
  const categorySlug = toSlug(category);

  return productNames.map((name, index) => {
    const nameParts = name.split(' ');
    let hint = nameParts[0].toLowerCase();

    if (category === "Essential | Spice Oil" || category === "Range of Carrier Oil") {
       if (name.toLowerCase().includes("oil")) {
         hint = name.toLowerCase().replace("oil", "").trim().split(" ").slice(0,2).join(" ");
       } else {
         hint = name.toLowerCase().split(" ").slice(0,2).join(" ");
       }
    } else if (category === "Extract | Soluble Oil" || category === "PG | Water Extract") {
        hint = nameParts[0].toLowerCase();
        if (name.includes("(")) {
            hint = name.substring(0, name.indexOf("(")).trim().toLowerCase();
        }
        if (hint === "extract" && nameParts.length > 1 && !nameParts[0].toLowerCase().includes("extract")) {
            hint = nameParts[0].toLowerCase() + " extract";
        } else if (!hint.includes("extract") && !nameParts[0].toLowerCase().includes("extract")) {
             hint += " extract";
        }
        if (name.toLowerCase() === "ghrit kumari (aloe vera)") hint = "aloe vera extract";

    } else if (category === "Ayurvedic Oil") {
        hint = nameParts[0].toLowerCase();
        if (name.includes("(")) {
            hint = name.substring(0, name.indexOf("(")).trim().toLowerCase();
        }
        if (hint === "ayurvedic" && nameParts.length > 1 && !nameParts[0].toLowerCase().includes("ayurvedic")) {
             hint = nameParts[0].toLowerCase() + " ayurvedic";
        } else if (!hint.includes("ayurvedic") && !nameParts[0].toLowerCase().includes("ayurvedic") && !name.toLowerCase().includes("oil")) {
             hint += " ayurvedic";
        }
        if (name.toLowerCase() === "ghrit kumari (aloe vera)") hint = "aloe vera ayurvedic";
    }

    if (name.toLowerCase().includes("calendula oil (pure)")) hint = "calendula flower";
    if (name.toLowerCase().includes("curry leaf oil (pure)")) hint = "curry leaf";
    if (name.toLowerCase().includes("curry leaf oil (rco)")) hint = "curry leaf";
    if (name.toLowerCase().includes("garlic oil (pure)")) hint = "garlic bulb";
    if (name.toLowerCase().includes("niroli oil pure")) hint = "neroli flower";
    hint = hint.replace(/\(.*\)/, '').trim(); // Remove content in parenthesis for hint


    return {
      id: `${categorySlug}-${toSlug(name)}-${index}`,
      name: name,
      description: `High-quality ${name}. Sourced for purity and effectiveness by ${SITE_NAME}.`,
      longDescription: STATIC_DESCRIPTION_PLACEHOLDER_TEMPLATE(name, category),
      imageUrl: `https://placehold.co/600x400.png`,
      dataAiHint: hint.trim(),
      category: category,
      characteristics: ["Natural", "High Quality"],
      usageTips: `Ideal for various applications depending on the product type. Always consult guidelines for proper use. For ${name}, typical uses include...`,
      origin: "Sourced from the finest available natural ingredients.",
      packagingOptions: [{ size: "100ml/g" }, { size: "250ml/g" }, { size: "500ml/g" }, {size: "1L/kg"}],
      isFeatured: false,
      attributes: [{ key: "Type", value: category }, {key: "Form", value: categoryType }],
    };
  });
}

const essentialSpiceOilPlaceholders = generatePlaceholderProducts(essentialSpiceOilProductNames, "Essential | Spice Oil");
const rangeOfCarrierOilPlaceholders = generatePlaceholderProducts(rangeOfCarrierOilProductNames, "Range of Carrier Oil");
const extractSolubleOilPlaceholders = generatePlaceholderProducts(extractSolubleOilProductNames, "Extract | Soluble Oil");
const pgWaterExtractPlaceholders = generatePlaceholderProducts(pgWaterExtractProductNames, "PG | Water Extract");
const ayurvedicOilPlaceholders = generatePlaceholderProducts(ayurvedicOilProductNames, "Ayurvedic Oil");


export async function getProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const querySnapshot = await getDocs(productsCollection);
    const products = querySnapshot.docs.map(docToProduct);

    const allHardcoded = [
        ...essentialSpiceOilPlaceholders,
        ...rangeOfCarrierOilPlaceholders,
        ...extractSolubleOilPlaceholders,
        ...pgWaterExtractPlaceholders,
        ...ayurvedicOilPlaceholders
    ];
    const combined = [...products];
    allHardcoded.forEach(hp => {
        if (!products.find(p => p.id === hp.id)) {
            combined.push(hp);
        }
    });
    return combined;

  } catch (error) {
    console.error("Error fetching products:", error);
    return [
        ...essentialSpiceOilPlaceholders,
        ...rangeOfCarrierOilPlaceholders,
        ...extractSolubleOilPlaceholders,
        ...pgWaterExtractPlaceholders,
        ...ayurvedicOilPlaceholders
    ];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const allHardcodedProducts = [
      ...essentialSpiceOilPlaceholders,
      ...rangeOfCarrierOilPlaceholders,
      ...extractSolubleOilPlaceholders,
      ...pgWaterExtractPlaceholders,
      ...ayurvedicOilPlaceholders
  ];
  let product = allHardcodedProducts.find(p => p.id === id);

  if (product) {
    // For hardcoded products, the longDescription is already set by generatePlaceholderProducts
    // No need for AI generation here as per the revert request.
    return product;
  }

  try {
    const productDocRef = doc(db, 'products', id);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      const fetchedProduct = docToProduct(productDoc);
      // If fetched from Firestore and longDescription is missing, it will use the static placeholder from docToProduct.
      return fetchedProduct;
    } else {
      console.log(`No such product document in Firestore for ID: ${id}!`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID from Firestore:", id, error);
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
    const featuredHardcoded = [
        ...essentialSpiceOilPlaceholders,
        ...rangeOfCarrierOilPlaceholders,
        ...extractSolubleOilPlaceholders,
        ...pgWaterExtractPlaceholders,
        ...ayurvedicOilPlaceholders,
    ].filter(p => p.isFeatured).slice(0, count);
    return featuredHardcoded;
  }
}

export async function getProductsByCategoryName(categoryName: string): Promise<Product[]> {
  if (categoryName === "Essential | Spice Oil") {
    return essentialSpiceOilPlaceholders;
  }
  if (categoryName === "Range of Carrier Oil") {
    return rangeOfCarrierOilPlaceholders;
  }
  if (categoryName === "Extract | Soluble Oil") {
    return extractSolubleOilPlaceholders;
  }
  if (categoryName === "PG | Water Extract") {
    return pgWaterExtractPlaceholders;
  }
  if (categoryName === "Ayurvedic Oil") {
    return ayurvedicOilPlaceholders;
  }

  try {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where("category", "==", categoryName));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No products found in Firestore for category: ${categoryName}.`);
    }
    const products = querySnapshot.docs.map(docToProduct);
    return products;
  } catch (error) {
    console.error(`Error fetching products for category "${categoryName}":`, error);
    return [];
  }
}
