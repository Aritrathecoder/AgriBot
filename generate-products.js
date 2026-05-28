const fs = require('fs');

const categories = ['Fertilizer', 'Pesticide', 'Seeds', 'Tools'];
const adjectives = ['Premium', 'Organic', 'High-Yield', 'Advanced', 'Eco-Friendly', 'Professional', 'Heavy-Duty', 'Natural', 'Hybrid', 'Bio-Active'];
const baseNames = {
  'Fertilizer': ['Neem Cake', 'NPK Blend', 'Compost', 'Urea', 'Phosphorus Boost', 'Seaweed Extract', 'Vermicompost', 'Bone Meal', 'Potash', 'Liquid Fertilizer'],
  'Pesticide': ['Neem Oil', 'Bio-Pesticide Spray', 'Insecticidal Soap', 'Fungicide', 'Herbicide', 'Mite Control', 'Caterpillar Killer', 'Root Protectant', 'Plant Guard', 'Eco-Shield'],
  'Seeds': ['Tomato Seeds F1', 'Wheat Seeds', 'Rice Paddy Seeds', 'Potato Seeds', 'Chili Seeds', 'Cucumber Seeds', 'Cabbage Seeds', 'Carrot Seeds', 'Onion Seeds', 'Spinach Seeds'],
  'Tools': ['Pruning Shears', 'Garden Trowel', 'Watering Can', 'Spade', 'Hoe', 'Garden Gloves', 'Sprayer Pump', 'Soil pH Meter', 'Grafting Knife', 'Harvesting Sickle']
};

const products = [];

for (let i = 1; i <= 60; i++) {
  const category = categories[i % categories.length];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const baseName = baseNames[category][Math.floor(Math.random() * baseNames[category].length)];
  
  const name = `AgriBot ${adjective} ${baseName}`;
  const price = Math.floor(Math.random() * 800) + 99;
  const originalPrice = price + Math.floor(Math.random() * 300) + 50;
  
  const seed = `agri${i}`;
  const seed2 = `agrib${i}`;
  
  const usageDict = {
    // Fertilizers
    'Neem Cake': ['Mix 100g of neem cake per square meter of soil before sowing.', 'Water the soil deeply to activate the azadirachtin compounds.', 'Reapply every 45 days to maintain nematode protection and slow nitrogen release.'],
    'NPK Blend': ['Apply 50g per plant as a side dressing away from the main stem.', 'Incorporate lightly into the top 2 inches of soil.', 'Water immediately so the granular blend begins dissolving.'],
    'Compost': ['Spread a 2-inch layer over the entire garden bed.', 'Till it into the top 6 inches of native soil to improve organic matter.', 'Can also be used as a top-dressing mulch during peak summer.'],
    'Urea': ['Broadcast 20-30g per square meter evenly across the field.', 'Ensure soil is moist before application to prevent ammonia volatilization.', 'Avoid applying near seeds to prevent nitrogen toxicity.'],
    'Phosphorus Boost': ['Apply directly into the planting hole before placing the root ball.', 'Mix with a handful of native soil to avoid direct root burn.', 'Essential for early root development; do not apply late in the season.'],
    'Seaweed Extract': ['Dilute 3ml per liter of water in a spray bottle.', 'Foliar spray early in the morning when stomata are open.', 'Apply every 14 days to boost stress tolerance and micronutrient absorption.'],
    'Vermicompost': ['Add 200g per pot or sprinkle around the drip line of trees.', 'Mix gently into the topsoil to preserve beneficial microbes.', 'Excellent for retaining moisture and suppressing soil-borne diseases.'],
    'Bone Meal': ['Apply 1 tablespoon per planting hole for bulbs and root crops.', 'Work into the soil well as it takes months to break down completely.', 'Keep away from pets, as the scent may attract dogs.'],
    'Potash': ['Apply 20g per plant during the flowering or fruiting stage.', 'Scatter around the base and water heavily to move potassium into the root zone.', 'Do not overuse, as excess potassium locks up calcium and magnesium.'],
    'Liquid Fertilizer': ['Dilute 10ml in 5 liters of water in a watering can.', 'Apply directly to the soil at the base of the plant.', 'Use weekly during rapid growth phases for immediate nutrient uptake.'],

    // Pesticides
    'Neem Oil': ['Mix 5ml neem oil and 2ml mild liquid soap in 1 liter of warm water.', 'Spray thoroughly covering the tops and bottoms of leaves.', 'Apply late in the evening to prevent sunburn and avoid harming bees.'],
    'Bio-Pesticide Spray': ['Shake the bottle vigorously before use to activate bacterial spores.', 'Spray lightly on affected areas at the first sign of infestation.', 'Repeat every 5-7 days until the pest population is fully eradicated.'],
    'Insecticidal Soap': ['Dilute 10ml per liter of soft water (do not use hard water).', 'Ensure direct contact with soft-bodied insects like aphids or whiteflies.', 'Rinse leaves with clean water 24 hours later if signs of phytotoxicity appear.'],
    'Fungicide': ['Mix 2g of powder per liter of water.', 'Spray preventatively before heavy monsoons or when high humidity is expected.', 'Focus on the lower canopy where fungal spores splash up from the soil.'],
    'Herbicide': ['Use a targeted nozzle to spray only on actively growing weeds.', 'Apply on a calm, windless day to avoid drift onto your crops.', 'Do not walk through the sprayed area for at least 12 hours.'],
    'Mite Control': ['Dilute 3ml per liter and use a high-pressure sprayer.', 'Focus heavily on the underside of leaves where spider mites form webs.', 'Apply twice, spaced exactly 4 days apart, to break the egg-hatching cycle.'],
    'Caterpillar Killer': ['Mix 1 teaspoon of Bt (Bacillus thuringiensis) per gallon of water.', 'Spray foliage thoroughly; caterpillars must ingest the leaves for it to work.', 'Reapply after heavy rain as the bacteria will wash off.'],
    'Root Protectant': ['Dilute 5ml per liter and use as a soil drench.', 'Pour 100ml of the solution directly at the base of each seedling.', 'Use immediately after transplanting to prevent damping-off disease.'],
    'Plant Guard': ['Spray a fine mist over the entire plant canopy.', 'Forms a physical barrier against chewing insects and environmental stress.', 'Reapply every 2 weeks or as the plant outgrows the protective film.'],
    'Eco-Shield': ['Mix with water at a 1:100 ratio.', 'Apply evenly across the field using a boom sprayer.', 'Safe for beneficial insects; no waiting period required before harvest.'],

    // Seeds
    'Tomato Seeds F1': ['Start seeds indoors in seedling trays 6 weeks before the last frost.', 'Plant seeds 1/4 inch deep in sterile seed-starting mix.', 'Keep soil at 75°F (24°C) for optimal germination within 5-7 days.'],
    'Wheat Seeds': ['Broadcast seeds evenly over a well-tilled, weed-free field.', 'Harrow the field lightly to cover seeds with 1 inch of soil.', 'Apply the first irrigation immediately after sowing if the soil is dry.'],
    'Rice Paddy Seeds': ['Soak seeds in water for 24 hours, then incubate in burlap sacks for 48 hours to pre-germinate.', 'Broadcast pre-germinated seeds onto a puddled and leveled field.', 'Maintain a shallow water layer of 2-3 cm during early growth.'],
    'Potato Seeds': ['Cut seed potatoes into chunks, ensuring each chunk has at least 2 "eyes".', 'Let the cut pieces cure in a dry place for 2 days before planting.', 'Plant 4 inches deep and hill the soil up around the stem as the plant grows.'],
    'Chili Seeds': ['Sow seeds 1/4 inch deep in trays kept in a warm location (80°F/27°C).', 'Transplant seedlings when they have 4-6 true leaves.', 'Harden off seedlings for a week before moving them to full sun.'],
    'Cucumber Seeds': ['Plant seeds directly in mounds or hills, 1 inch deep, putting 3 seeds per hill.', 'Space hills at least 3 feet apart to allow vines to spread.', 'Keep soil consistently moist, especially once flowers appear.'],
    'Cabbage Seeds': ['Sow seeds 1/2 inch deep in rows spaced 2 feet apart.', 'Thin seedlings so that remaining plants are 18 inches apart.', 'Apply a nitrogen-rich fertilizer 3 weeks after transplanting.'],
    'Carrot Seeds': ['Sow seeds very shallowly (1/8 inch) directly into deeply tilled, rock-free soil.', 'Do not let the soil surface dry out until germination (can take up to 21 days).', 'Thin seedlings strictly to 2 inches apart to allow root expansion.'],
    'Onion Seeds': ['Sow seeds indoors 8-10 weeks before transplanting.', 'Trim the tops of the seedlings to 3 inches tall when transplanting to encourage root growth.', 'Plant just deep enough to hold the seedling upright.'],
    'Spinach Seeds': ['Sow seeds 1/2 inch deep directly in the garden as soon as the soil can be worked.', 'Plant in partial shade if growing in hot weather to prevent early bolting.', 'Harvest outer leaves continuously to encourage new growth.'],

    // Tools
    'Pruning Shears': ['Unlock the safety catch and ensure the bypass blades are aligned.', 'Make cuts at a 45-degree angle, about 1/4 inch above a healthy bud.', 'Wipe blades with rubbing alcohol between plants to prevent spreading diseases.'],
    'Garden Trowel': ['Grip the ergonomic handle firmly and plunge the steel scoop into the soil.', 'Use to dig holes for seedlings, measure depth, or mix potting soil.', 'Rinse off mud and dry completely to prevent rust on the metal head.'],
    'Watering Can': ['Fill with water, adding any liquid fertilizers if required.', 'Use the rose (sprinkler head) for gentle watering of fragile seedlings.', 'Remove the rose for direct, high-volume watering at the base of mature plants.'],
    'Spade': ['Place the blade against the soil and step heavily on the flat top edge.', 'Use for edging beds, slicing through tough roots, or turning over sod.', 'Store hanging vertically in a shed to protect the wooden handle.'],
    'Hoe': ['Hold the handle upright and use a sweeping motion to slice weeds just below the soil surface.', 'Keep the blade sharp using a mill file for effortless weeding.', 'Do not chop forcefully into rocky soil to avoid chipping the blade.'],
    'Garden Gloves': ['Pull gloves snugly over hands before handling thorny plants or harsh fertilizers.', 'The nitrile-coated palms provide grip even when wet.', 'Hand wash with mild soap and air dry; do not put in a washing machine.'],
    'Sprayer Pump': ['Fill the tank up to the maximum fill line, leaving space for air compression.', 'Pump the handle 15-20 times to build pressure.', 'Adjust the brass nozzle for either a fine mist or a direct stream.'],
    'Soil pH Meter': ['Wipe the metallic probes clean with a dry cloth before use.', 'Insert the probes vertically into moist soil down to root level (about 4 inches).', 'Wait 60 seconds for the reading to stabilize before recording the pH.'],
    'Grafting Knife': ['Ensure the blade is razor-sharp for clean, non-crushing cuts.', 'Make a smooth, single-motion slice on both the scion and rootstock.', 'Clean the blade meticulously with ethanol after every single graft.'],
    'Harvesting Sickle': ['Grip a bunch of stalks with your free hand (wearing a glove).', 'Hook the sickle around the base and pull sharply towards you.', 'Keep the curved blade sharpened and coated with oil when not in use.']
  };

  const getUsageInstructions = (category, baseName) => {
    return usageDict[baseName] || [
      `Carefully unpack the ${baseName.toLowerCase()}.`,
      `Follow standard agricultural practices for this item.`,
      `Store safely when not in use.`
    ];
  };

  const usageInstructions = getUsageInstructions(category, baseName);
  
  products.push({
    id: `agri-${category.toLowerCase().substring(0,4)}-${i.toString().padStart(3, '0')}`,
    name: name,
    price: price,
    originalPrice: originalPrice,
    description: `High-quality ${name.toLowerCase()} designed for Indian farmers. Provides excellent results and improves overall farm yield.`,
    images: [
      `https://loremflickr.com/800/800/agriculture,${category.toLowerCase()}?lock=${i}`,
      `https://loremflickr.com/800/800/farming,${category.toLowerCase()}?lock=${i + 100}`
    ],
    features: [
      `Premium ${category.toLowerCase()} grade`,
      `Tested for high efficiency`,
      `Trusted by farmers nationwide`,
      `Easy to store and use`
    ],
    usageInstructions: usageInstructions,
    category: category,
    stock: Math.floor(Math.random() * 100) + 1,
    rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
    reviews: [
      {
        id: `rev-${i}`,
        user: `Farmer ${Math.floor(Math.random() * 1000)}`,
        rating: 5,
        comment: `Great product, very helpful for my crops.`,
        date: `2026-05-${Math.floor(Math.random() * 28) + 1}`
      }
    ]
  });
}

const fileContent = `export interface ProductReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  images: string[];
  features: string[];
  usageInstructions: string[];
  category: "Fertilizer" | "Pesticide" | "Seeds" | "Tools";
  stock: number;
  rating: number;
  reviews: ProductReview[];
}

export const agribotsProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync('src/data/products.ts', fileContent);
console.log('Successfully generated 60 products with JPG images.');
