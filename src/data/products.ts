export interface ProductReview {
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
  image?: string;
  features: string[];
  usageInstructions: string[];
  category: "Fertilizer" | "Pesticide" | "Seeds" | "Tools";
  stock: number;
  rating: number;
  reviews: ProductReview[];
}

export const agribotsProducts: Product[] = [
  {
    "id": "agri-pest-001",
    "name": "AgriBot Bio-Active Mite Control",
    "price": 371,
    "originalPrice": 639,
    "description": "High-quality agribot bio-active mite control designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=1",
      "https://loremflickr.com/800/800/farming,pesticide?lock=101"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 3ml per liter and use a high-pressure sprayer.",
      "Focus heavily on the underside of leaves where spider mites form webs.",
      "Apply twice, spaced exactly 4 days apart, to break the egg-hatching cycle."
    ],
    "category": "Pesticide",
    "stock": 98,
    "rating": 5,
    "reviews": [
      {
        "id": "rev-1",
        "user": "Farmer 133",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-2"
      }
    ]
  },
  {
    "id": "agri-seed-002",
    "name": "AgriBot Hybrid Onion Seeds",
    "price": 817,
    "originalPrice": 885,
    "description": "High-quality agribot hybrid onion seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=2",
      "https://loremflickr.com/800/800/farming,seeds?lock=102"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds indoors 8-10 weeks before transplanting.",
      "Trim the tops of the seedlings to 3 inches tall when transplanting to encourage root growth.",
      "Plant just deep enough to hold the seedling upright."
    ],
    "category": "Seeds",
    "stock": 70,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-2",
        "user": "Farmer 515",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-19"
      }
    ]
  },
  {
    "id": "agri-tool-003",
    "name": "AgriBot Natural Watering Can",
    "price": 601,
    "originalPrice": 880,
    "description": "High-quality agribot natural watering can designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=3",
      "https://loremflickr.com/800/800/farming,tools?lock=103"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Fill with water, adding any liquid fertilizers if required.",
      "Use the rose (sprinkler head) for gentle watering of fragile seedlings.",
      "Remove the rose for direct, high-volume watering at the base of mature plants."
    ],
    "category": "Tools",
    "stock": 95,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev-3",
        "user": "Farmer 234",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-18"
      }
    ]
  },
  {
    "id": "agri-fert-004",
    "name": "AgriBot Natural Seaweed Extract",
    "price": 213,
    "originalPrice": 393,
    "description": "High-quality agribot natural seaweed extract designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=4",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=104"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 3ml per liter of water in a spray bottle.",
      "Foliar spray early in the morning when stomata are open.",
      "Apply every 14 days to boost stress tolerance and micronutrient absorption."
    ],
    "category": "Fertilizer",
    "stock": 90,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-4",
        "user": "Farmer 326",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-27"
      }
    ]
  },
  {
    "id": "agri-pest-005",
    "name": "AgriBot Premium Bio-Pesticide Spray",
    "price": 393,
    "originalPrice": 618,
    "description": "High-quality agribot premium bio-pesticide spray designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=5",
      "https://loremflickr.com/800/800/farming,pesticide?lock=105"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Shake the bottle vigorously before use to activate bacterial spores.",
      "Spray lightly on affected areas at the first sign of infestation.",
      "Repeat every 5-7 days until the pest population is fully eradicated."
    ],
    "category": "Pesticide",
    "stock": 73,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev-5",
        "user": "Farmer 428",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-26"
      }
    ]
  },
  {
    "id": "agri-seed-006",
    "name": "AgriBot Heavy-Duty Spinach Seeds",
    "price": 324,
    "originalPrice": 548,
    "description": "High-quality agribot heavy-duty spinach seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=6",
      "https://loremflickr.com/800/800/farming,seeds?lock=106"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds 1/2 inch deep directly in the garden as soon as the soil can be worked.",
      "Plant in partial shade if growing in hot weather to prevent early bolting.",
      "Harvest outer leaves continuously to encourage new growth."
    ],
    "category": "Seeds",
    "stock": 27,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-6",
        "user": "Farmer 793",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-27"
      }
    ]
  },
  {
    "id": "agri-tool-007",
    "name": "AgriBot Eco-Friendly Soil pH Meter",
    "price": 258,
    "originalPrice": 423,
    "description": "High-quality agribot eco-friendly soil ph meter designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=7",
      "https://loremflickr.com/800/800/farming,tools?lock=107"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Wipe the metallic probes clean with a dry cloth before use.",
      "Insert the probes vertically into moist soil down to root level (about 4 inches).",
      "Wait 60 seconds for the reading to stabilize before recording the pH."
    ],
    "category": "Tools",
    "stock": 99,
    "rating": 4,
    "reviews": [
      {
        "id": "rev-7",
        "user": "Farmer 395",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-21"
      }
    ]
  },
  {
    "id": "agri-fert-008",
    "name": "AgriBot Hybrid Phosphorus Boost",
    "price": 353,
    "originalPrice": 566,
    "description": "High-quality agribot hybrid phosphorus boost designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=8",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=108"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Apply directly into the planting hole before placing the root ball.",
      "Mix with a handful of native soil to avoid direct root burn.",
      "Essential for early root development; do not apply late in the season."
    ],
    "category": "Fertilizer",
    "stock": 50,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-8",
        "user": "Farmer 898",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-25"
      }
    ]
  },
  {
    "id": "agri-pest-009",
    "name": "AgriBot Bio-Active Root Protectant",
    "price": 520,
    "originalPrice": 826,
    "description": "High-quality agribot bio-active root protectant designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=9",
      "https://loremflickr.com/800/800/farming,pesticide?lock=109"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 5ml per liter and use as a soil drench.",
      "Pour 100ml of the solution directly at the base of each seedling.",
      "Use immediately after transplanting to prevent damping-off disease."
    ],
    "category": "Pesticide",
    "stock": 86,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-9",
        "user": "Farmer 645",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-8"
      }
    ]
  },
  {
    "id": "agri-seed-010",
    "name": "AgriBot Heavy-Duty Potato Seeds",
    "price": 496,
    "originalPrice": 706,
    "description": "High-quality agribot heavy-duty potato seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=10",
      "https://loremflickr.com/800/800/farming,seeds?lock=110"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Cut seed potatoes into chunks, ensuring each chunk has at least 2 \"eyes\".",
      "Let the cut pieces cure in a dry place for 2 days before planting.",
      "Plant 4 inches deep and hill the soil up around the stem as the plant grows."
    ],
    "category": "Seeds",
    "stock": 59,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-10",
        "user": "Farmer 862",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-20"
      }
    ]
  },
  {
    "id": "agri-tool-011",
    "name": "AgriBot Organic Grafting Knife",
    "price": 437,
    "originalPrice": 763,
    "description": "High-quality agribot organic grafting knife designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=11",
      "https://loremflickr.com/800/800/farming,tools?lock=111"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Ensure the blade is razor-sharp for clean, non-crushing cuts.",
      "Make a smooth, single-motion slice on both the scion and rootstock.",
      "Clean the blade meticulously with ethanol after every single graft."
    ],
    "category": "Tools",
    "stock": 71,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-11",
        "user": "Farmer 36",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-20"
      }
    ]
  },
  {
    "id": "agri-fert-012",
    "name": "AgriBot Premium Compost",
    "price": 819,
    "originalPrice": 1119,
    "description": "High-quality agribot premium compost designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=12",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=112"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Spread a 2-inch layer over the entire garden bed.",
      "Till it into the top 6 inches of native soil to improve organic matter.",
      "Can also be used as a top-dressing mulch during peak summer."
    ],
    "category": "Fertilizer",
    "stock": 14,
    "rating": 4.4,
    "reviews": [
      {
        "id": "rev-12",
        "user": "Farmer 288",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-26"
      }
    ]
  },
  {
    "id": "agri-pest-013",
    "name": "AgriBot Advanced Caterpillar Killer",
    "price": 883,
    "originalPrice": 1199,
    "description": "High-quality agribot advanced caterpillar killer designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=13",
      "https://loremflickr.com/800/800/farming,pesticide?lock=113"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Mix 1 teaspoon of Bt (Bacillus thuringiensis) per gallon of water.",
      "Spray foliage thoroughly; caterpillars must ingest the leaves for it to work.",
      "Reapply after heavy rain as the bacteria will wash off."
    ],
    "category": "Pesticide",
    "stock": 64,
    "rating": 5,
    "reviews": [
      {
        "id": "rev-13",
        "user": "Farmer 36",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-13"
      }
    ]
  },
  {
    "id": "agri-seed-014",
    "name": "AgriBot Organic Wheat Seeds",
    "price": 851,
    "originalPrice": 1032,
    "description": "High-quality agribot organic wheat seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=14",
      "https://loremflickr.com/800/800/farming,seeds?lock=114"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Broadcast seeds evenly over a well-tilled, weed-free field.",
      "Harrow the field lightly to cover seeds with 1 inch of soil.",
      "Apply the first irrigation immediately after sowing if the soil is dry."
    ],
    "category": "Seeds",
    "stock": 4,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-14",
        "user": "Farmer 972",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-2"
      }
    ]
  },
  {
    "id": "agri-tool-015",
    "name": "AgriBot Professional Harvesting Sickle",
    "price": 393,
    "originalPrice": 692,
    "description": "High-quality agribot professional harvesting sickle designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=15",
      "https://loremflickr.com/800/800/farming,tools?lock=115"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Grip a bunch of stalks with your free hand (wearing a glove).",
      "Hook the sickle around the base and pull sharply towards you.",
      "Keep the curved blade sharpened and coated with oil when not in use."
    ],
    "category": "Tools",
    "stock": 22,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-15",
        "user": "Farmer 519",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-22"
      }
    ]
  },
  {
    "id": "agri-fert-016",
    "name": "AgriBot Bio-Active Potash",
    "price": 859,
    "originalPrice": 1133,
    "description": "High-quality agribot bio-active potash designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=16",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=116"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Apply 20g per plant during the flowering or fruiting stage.",
      "Scatter around the base and water heavily to move potassium into the root zone.",
      "Do not overuse, as excess potassium locks up calcium and magnesium."
    ],
    "category": "Fertilizer",
    "stock": 36,
    "rating": 4.1,
    "reviews": [
      {
        "id": "rev-16",
        "user": "Farmer 776",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-20"
      }
    ]
  },
  {
    "id": "agri-pest-017",
    "name": "AgriBot Organic Mite Control",
    "price": 815,
    "originalPrice": 933,
    "description": "High-quality agribot organic mite control designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=17",
      "https://loremflickr.com/800/800/farming,pesticide?lock=117"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 3ml per liter and use a high-pressure sprayer.",
      "Focus heavily on the underside of leaves where spider mites form webs.",
      "Apply twice, spaced exactly 4 days apart, to break the egg-hatching cycle."
    ],
    "category": "Pesticide",
    "stock": 70,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-17",
        "user": "Farmer 514",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-7"
      }
    ]
  },
  {
    "id": "agri-seed-018",
    "name": "AgriBot Premium Onion Seeds",
    "price": 726,
    "originalPrice": 806,
    "description": "High-quality agribot premium onion seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=18",
      "https://loremflickr.com/800/800/farming,seeds?lock=118"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds indoors 8-10 weeks before transplanting.",
      "Trim the tops of the seedlings to 3 inches tall when transplanting to encourage root growth.",
      "Plant just deep enough to hold the seedling upright."
    ],
    "category": "Seeds",
    "stock": 77,
    "rating": 5,
    "reviews": [
      {
        "id": "rev-18",
        "user": "Farmer 646",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-2"
      }
    ]
  },
  {
    "id": "agri-tool-019",
    "name": "AgriBot High-Yield Grafting Knife",
    "price": 100,
    "originalPrice": 177,
    "description": "High-quality agribot high-yield grafting knife designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=19",
      "https://loremflickr.com/800/800/farming,tools?lock=119"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Ensure the blade is razor-sharp for clean, non-crushing cuts.",
      "Make a smooth, single-motion slice on both the scion and rootstock.",
      "Clean the blade meticulously with ethanol after every single graft."
    ],
    "category": "Tools",
    "stock": 82,
    "rating": 4.4,
    "reviews": [
      {
        "id": "rev-19",
        "user": "Farmer 621",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-9"
      }
    ]
  },
  {
    "id": "agri-fert-020",
    "name": "AgriBot Premium Bone Meal",
    "price": 714,
    "originalPrice": 1000,
    "description": "High-quality agribot premium bone meal designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=20",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=120"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Apply 1 tablespoon per planting hole for bulbs and root crops.",
      "Work into the soil well as it takes months to break down completely.",
      "Keep away from pets, as the scent may attract dogs."
    ],
    "category": "Fertilizer",
    "stock": 64,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-20",
        "user": "Farmer 746",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-10"
      }
    ]
  },
  {
    "id": "agri-pest-021",
    "name": "AgriBot Eco-Friendly Herbicide",
    "price": 327,
    "originalPrice": 607,
    "description": "High-quality agribot eco-friendly herbicide designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=21",
      "https://loremflickr.com/800/800/farming,pesticide?lock=121"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Use a targeted nozzle to spray only on actively growing weeds.",
      "Apply on a calm, windless day to avoid drift onto your crops.",
      "Do not walk through the sprayed area for at least 12 hours."
    ],
    "category": "Pesticide",
    "stock": 29,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-21",
        "user": "Farmer 435",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-3"
      }
    ]
  },
  {
    "id": "agri-seed-022",
    "name": "AgriBot Eco-Friendly Chili Seeds",
    "price": 375,
    "originalPrice": 623,
    "description": "High-quality agribot eco-friendly chili seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=22",
      "https://loremflickr.com/800/800/farming,seeds?lock=122"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds 1/4 inch deep in trays kept in a warm location (80°F/27°C).",
      "Transplant seedlings when they have 4-6 true leaves.",
      "Harden off seedlings for a week before moving them to full sun."
    ],
    "category": "Seeds",
    "stock": 59,
    "rating": 4.4,
    "reviews": [
      {
        "id": "rev-22",
        "user": "Farmer 847",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-5"
      }
    ]
  },
  {
    "id": "agri-tool-023",
    "name": "AgriBot Professional Harvesting Sickle",
    "price": 484,
    "originalPrice": 648,
    "description": "High-quality agribot professional harvesting sickle designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=23",
      "https://loremflickr.com/800/800/farming,tools?lock=123"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Grip a bunch of stalks with your free hand (wearing a glove).",
      "Hook the sickle around the base and pull sharply towards you.",
      "Keep the curved blade sharpened and coated with oil when not in use."
    ],
    "category": "Tools",
    "stock": 38,
    "rating": 4.2,
    "reviews": [
      {
        "id": "rev-23",
        "user": "Farmer 66",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-6"
      }
    ]
  },
  {
    "id": "agri-fert-024",
    "name": "AgriBot Professional NPK Blend",
    "price": 850,
    "originalPrice": 1131,
    "description": "High-quality agribot professional npk blend designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=24",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=124"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Apply 50g per plant as a side dressing away from the main stem.",
      "Incorporate lightly into the top 2 inches of soil.",
      "Water immediately so the granular blend begins dissolving."
    ],
    "category": "Fertilizer",
    "stock": 33,
    "rating": 4.1,
    "reviews": [
      {
        "id": "rev-24",
        "user": "Farmer 504",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-25"
      }
    ]
  },
  {
    "id": "agri-pest-025",
    "name": "AgriBot Heavy-Duty Root Protectant",
    "price": 331,
    "originalPrice": 484,
    "description": "High-quality agribot heavy-duty root protectant designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=25",
      "https://loremflickr.com/800/800/farming,pesticide?lock=125"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 5ml per liter and use as a soil drench.",
      "Pour 100ml of the solution directly at the base of each seedling.",
      "Use immediately after transplanting to prevent damping-off disease."
    ],
    "category": "Pesticide",
    "stock": 79,
    "rating": 4.2,
    "reviews": [
      {
        "id": "rev-25",
        "user": "Farmer 940",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-4"
      }
    ]
  },
  {
    "id": "agri-seed-026",
    "name": "AgriBot Advanced Chili Seeds",
    "price": 163,
    "originalPrice": 461,
    "description": "High-quality agribot advanced chili seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=26",
      "https://loremflickr.com/800/800/farming,seeds?lock=126"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds 1/4 inch deep in trays kept in a warm location (80°F/27°C).",
      "Transplant seedlings when they have 4-6 true leaves.",
      "Harden off seedlings for a week before moving them to full sun."
    ],
    "category": "Seeds",
    "stock": 72,
    "rating": 4.1,
    "reviews": [
      {
        "id": "rev-26",
        "user": "Farmer 447",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-8"
      }
    ]
  },
  {
    "id": "agri-tool-027",
    "name": "AgriBot Premium Grafting Knife",
    "price": 731,
    "originalPrice": 807,
    "description": "High-quality agribot premium grafting knife designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=27",
      "https://loremflickr.com/800/800/farming,tools?lock=127"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Ensure the blade is razor-sharp for clean, non-crushing cuts.",
      "Make a smooth, single-motion slice on both the scion and rootstock.",
      "Clean the blade meticulously with ethanol after every single graft."
    ],
    "category": "Tools",
    "stock": 60,
    "rating": 4.1,
    "reviews": [
      {
        "id": "rev-27",
        "user": "Farmer 952",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-1"
      }
    ]
  },
  {
    "id": "agri-fert-028",
    "name": "AgriBot Bio-Active Neem Cake",
    "price": 217,
    "originalPrice": 317,
    "description": "High-quality agribot bio-active neem cake designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=28",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=128"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Mix 100g of neem cake per square meter of soil before sowing.",
      "Water the soil deeply to activate the azadirachtin compounds.",
      "Reapply every 45 days to maintain nematode protection and slow nitrogen release."
    ],
    "category": "Fertilizer",
    "stock": 12,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-28",
        "user": "Farmer 439",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-27"
      }
    ]
  },
  {
    "id": "agri-pest-029",
    "name": "AgriBot Professional Caterpillar Killer",
    "price": 482,
    "originalPrice": 709,
    "description": "High-quality agribot professional caterpillar killer designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=29",
      "https://loremflickr.com/800/800/farming,pesticide?lock=129"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Mix 1 teaspoon of Bt (Bacillus thuringiensis) per gallon of water.",
      "Spray foliage thoroughly; caterpillars must ingest the leaves for it to work.",
      "Reapply after heavy rain as the bacteria will wash off."
    ],
    "category": "Pesticide",
    "stock": 20,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-29",
        "user": "Farmer 462",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-20"
      }
    ]
  },
  {
    "id": "agri-seed-030",
    "name": "AgriBot Eco-Friendly Onion Seeds",
    "price": 617,
    "originalPrice": 965,
    "description": "High-quality agribot eco-friendly onion seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=30",
      "https://loremflickr.com/800/800/farming,seeds?lock=130"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds indoors 8-10 weeks before transplanting.",
      "Trim the tops of the seedlings to 3 inches tall when transplanting to encourage root growth.",
      "Plant just deep enough to hold the seedling upright."
    ],
    "category": "Seeds",
    "stock": 54,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-30",
        "user": "Farmer 504",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-14"
      }
    ]
  },
  {
    "id": "agri-tool-031",
    "name": "AgriBot Heavy-Duty Grafting Knife",
    "price": 336,
    "originalPrice": 541,
    "description": "High-quality agribot heavy-duty grafting knife designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=31",
      "https://loremflickr.com/800/800/farming,tools?lock=131"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Ensure the blade is razor-sharp for clean, non-crushing cuts.",
      "Make a smooth, single-motion slice on both the scion and rootstock.",
      "Clean the blade meticulously with ethanol after every single graft."
    ],
    "category": "Tools",
    "stock": 67,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-31",
        "user": "Farmer 304",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-10"
      }
    ]
  },
  {
    "id": "agri-fert-032",
    "name": "AgriBot Professional Neem Cake",
    "price": 274,
    "originalPrice": 440,
    "description": "High-quality agribot professional neem cake designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=32",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=132"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Mix 100g of neem cake per square meter of soil before sowing.",
      "Water the soil deeply to activate the azadirachtin compounds.",
      "Reapply every 45 days to maintain nematode protection and slow nitrogen release."
    ],
    "category": "Fertilizer",
    "stock": 97,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-32",
        "user": "Farmer 368",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-17"
      }
    ]
  },
  {
    "id": "agri-pest-033",
    "name": "AgriBot Bio-Active Caterpillar Killer",
    "price": 242,
    "originalPrice": 313,
    "description": "High-quality agribot bio-active caterpillar killer designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=33",
      "https://loremflickr.com/800/800/farming,pesticide?lock=133"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Mix 1 teaspoon of Bt (Bacillus thuringiensis) per gallon of water.",
      "Spray foliage thoroughly; caterpillars must ingest the leaves for it to work.",
      "Reapply after heavy rain as the bacteria will wash off."
    ],
    "category": "Pesticide",
    "stock": 31,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-33",
        "user": "Farmer 347",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-13"
      }
    ]
  },
  {
    "id": "agri-seed-034",
    "name": "AgriBot Advanced Tomato Seeds F1",
    "price": 662,
    "originalPrice": 983,
    "description": "High-quality agribot advanced tomato seeds f1 designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=34",
      "https://loremflickr.com/800/800/farming,seeds?lock=134"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Start seeds indoors in seedling trays 6 weeks before the last frost.",
      "Plant seeds 1/4 inch deep in sterile seed-starting mix.",
      "Keep soil at 75°F (24°C) for optimal germination within 5-7 days."
    ],
    "category": "Seeds",
    "stock": 55,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-34",
        "user": "Farmer 676",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-10"
      }
    ]
  },
  {
    "id": "agri-tool-035",
    "name": "AgriBot Advanced Garden Gloves",
    "price": 363,
    "originalPrice": 428,
    "description": "High-quality agribot advanced garden gloves designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=35",
      "https://loremflickr.com/800/800/farming,tools?lock=135"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Pull gloves snugly over hands before handling thorny plants or harsh fertilizers.",
      "The nitrile-coated palms provide grip even when wet.",
      "Hand wash with mild soap and air dry; do not put in a washing machine."
    ],
    "category": "Tools",
    "stock": 67,
    "rating": 4.1,
    "reviews": [
      {
        "id": "rev-35",
        "user": "Farmer 422",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-14"
      }
    ]
  },
  {
    "id": "agri-fert-036",
    "name": "AgriBot High-Yield Urea",
    "price": 692,
    "originalPrice": 964,
    "description": "High-quality agribot high-yield urea designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=36",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=136"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Broadcast 20-30g per square meter evenly across the field.",
      "Ensure soil is moist before application to prevent ammonia volatilization.",
      "Avoid applying near seeds to prevent nitrogen toxicity."
    ],
    "category": "Fertilizer",
    "stock": 51,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-36",
        "user": "Farmer 326",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-9"
      }
    ]
  },
  {
    "id": "agri-pest-037",
    "name": "AgriBot Natural Fungicide",
    "price": 247,
    "originalPrice": 549,
    "description": "High-quality agribot natural fungicide designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=37",
      "https://loremflickr.com/800/800/farming,pesticide?lock=137"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Mix 2g of powder per liter of water.",
      "Spray preventatively before heavy monsoons or when high humidity is expected.",
      "Focus on the lower canopy where fungal spores splash up from the soil."
    ],
    "category": "Pesticide",
    "stock": 86,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-37",
        "user": "Farmer 578",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-16"
      }
    ]
  },
  {
    "id": "agri-seed-038",
    "name": "AgriBot Natural Wheat Seeds",
    "price": 560,
    "originalPrice": 658,
    "description": "High-quality agribot natural wheat seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=38",
      "https://loremflickr.com/800/800/farming,seeds?lock=138"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Broadcast seeds evenly over a well-tilled, weed-free field.",
      "Harrow the field lightly to cover seeds with 1 inch of soil.",
      "Apply the first irrigation immediately after sowing if the soil is dry."
    ],
    "category": "Seeds",
    "stock": 19,
    "rating": 4.2,
    "reviews": [
      {
        "id": "rev-38",
        "user": "Farmer 854",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-2"
      }
    ]
  },
  {
    "id": "agri-tool-039",
    "name": "AgriBot Eco-Friendly Pruning Shears",
    "price": 254,
    "originalPrice": 334,
    "description": "High-quality agribot eco-friendly pruning shears designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=39",
      "https://loremflickr.com/800/800/farming,tools?lock=139"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Unlock the safety catch and ensure the bypass blades are aligned.",
      "Make cuts at a 45-degree angle, about 1/4 inch above a healthy bud.",
      "Wipe blades with rubbing alcohol between plants to prevent spreading diseases."
    ],
    "category": "Tools",
    "stock": 58,
    "rating": 4.2,
    "reviews": [
      {
        "id": "rev-39",
        "user": "Farmer 723",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-19"
      }
    ]
  },
  {
    "id": "agri-fert-040",
    "name": "AgriBot Hybrid Liquid Fertilizer",
    "price": 180,
    "originalPrice": 251,
    "description": "High-quality agribot hybrid liquid fertilizer designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=40",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=140"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 10ml in 5 liters of water in a watering can.",
      "Apply directly to the soil at the base of the plant.",
      "Use weekly during rapid growth phases for immediate nutrient uptake."
    ],
    "category": "Fertilizer",
    "stock": 52,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-40",
        "user": "Farmer 73",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-22"
      }
    ]
  },
  {
    "id": "agri-pest-041",
    "name": "AgriBot Hybrid Mite Control",
    "price": 783,
    "originalPrice": 905,
    "description": "High-quality agribot hybrid mite control designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=41",
      "https://loremflickr.com/800/800/farming,pesticide?lock=141"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 3ml per liter and use a high-pressure sprayer.",
      "Focus heavily on the underside of leaves where spider mites form webs.",
      "Apply twice, spaced exactly 4 days apart, to break the egg-hatching cycle."
    ],
    "category": "Pesticide",
    "stock": 8,
    "rating": 4.4,
    "reviews": [
      {
        "id": "rev-41",
        "user": "Farmer 441",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-16"
      }
    ]
  },
  {
    "id": "agri-seed-042",
    "name": "AgriBot Organic Carrot Seeds",
    "price": 381,
    "originalPrice": 665,
    "description": "High-quality agribot organic carrot seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=42",
      "https://loremflickr.com/800/800/farming,seeds?lock=142"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds very shallowly (1/8 inch) directly into deeply tilled, rock-free soil.",
      "Do not let the soil surface dry out until germination (can take up to 21 days).",
      "Thin seedlings strictly to 2 inches apart to allow root expansion."
    ],
    "category": "Seeds",
    "stock": 85,
    "rating": 4.1,
    "reviews": [
      {
        "id": "rev-42",
        "user": "Farmer 588",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-6"
      }
    ]
  },
  {
    "id": "agri-tool-043",
    "name": "AgriBot Organic Garden Trowel",
    "price": 269,
    "originalPrice": 322,
    "description": "High-quality agribot organic garden trowel designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=43",
      "https://loremflickr.com/800/800/farming,tools?lock=143"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Grip the ergonomic handle firmly and plunge the steel scoop into the soil.",
      "Use to dig holes for seedlings, measure depth, or mix potting soil.",
      "Rinse off mud and dry completely to prevent rust on the metal head."
    ],
    "category": "Tools",
    "stock": 42,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-43",
        "user": "Farmer 493",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-17"
      }
    ]
  },
  {
    "id": "agri-fert-044",
    "name": "AgriBot Heavy-Duty Vermicompost",
    "price": 783,
    "originalPrice": 953,
    "description": "High-quality agribot heavy-duty vermicompost designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=44",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=144"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Add 200g per pot or sprinkle around the drip line of trees.",
      "Mix gently into the topsoil to preserve beneficial microbes.",
      "Excellent for retaining moisture and suppressing soil-borne diseases."
    ],
    "category": "Fertilizer",
    "stock": 50,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-44",
        "user": "Farmer 478",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-12"
      }
    ]
  },
  {
    "id": "agri-pest-045",
    "name": "AgriBot Natural Mite Control",
    "price": 882,
    "originalPrice": 1225,
    "description": "High-quality agribot natural mite control designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=45",
      "https://loremflickr.com/800/800/farming,pesticide?lock=145"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 3ml per liter and use a high-pressure sprayer.",
      "Focus heavily on the underside of leaves where spider mites form webs.",
      "Apply twice, spaced exactly 4 days apart, to break the egg-hatching cycle."
    ],
    "category": "Pesticide",
    "stock": 31,
    "rating": 4.2,
    "reviews": [
      {
        "id": "rev-45",
        "user": "Farmer 961",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-10"
      }
    ]
  },
  {
    "id": "agri-seed-046",
    "name": "AgriBot Eco-Friendly Wheat Seeds",
    "price": 823,
    "originalPrice": 916,
    "description": "High-quality agribot eco-friendly wheat seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=46",
      "https://loremflickr.com/800/800/farming,seeds?lock=146"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Broadcast seeds evenly over a well-tilled, weed-free field.",
      "Harrow the field lightly to cover seeds with 1 inch of soil.",
      "Apply the first irrigation immediately after sowing if the soil is dry."
    ],
    "category": "Seeds",
    "stock": 4,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-46",
        "user": "Farmer 223",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-10"
      }
    ]
  },
  {
    "id": "agri-tool-047",
    "name": "AgriBot Professional Watering Can",
    "price": 398,
    "originalPrice": 602,
    "description": "High-quality agribot professional watering can designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=47",
      "https://loremflickr.com/800/800/farming,tools?lock=147"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Fill with water, adding any liquid fertilizers if required.",
      "Use the rose (sprinkler head) for gentle watering of fragile seedlings.",
      "Remove the rose for direct, high-volume watering at the base of mature plants."
    ],
    "category": "Tools",
    "stock": 44,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-47",
        "user": "Farmer 524",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-26"
      }
    ]
  },
  {
    "id": "agri-fert-048",
    "name": "AgriBot Premium Seaweed Extract",
    "price": 738,
    "originalPrice": 952,
    "description": "High-quality agribot premium seaweed extract designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=48",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=148"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 3ml per liter of water in a spray bottle.",
      "Foliar spray early in the morning when stomata are open.",
      "Apply every 14 days to boost stress tolerance and micronutrient absorption."
    ],
    "category": "Fertilizer",
    "stock": 95,
    "rating": 4.2,
    "reviews": [
      {
        "id": "rev-48",
        "user": "Farmer 937",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-1"
      }
    ]
  },
  {
    "id": "agri-pest-049",
    "name": "AgriBot Heavy-Duty Bio-Pesticide Spray",
    "price": 415,
    "originalPrice": 750,
    "description": "High-quality agribot heavy-duty bio-pesticide spray designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=49",
      "https://loremflickr.com/800/800/farming,pesticide?lock=149"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Shake the bottle vigorously before use to activate bacterial spores.",
      "Spray lightly on affected areas at the first sign of infestation.",
      "Repeat every 5-7 days until the pest population is fully eradicated."
    ],
    "category": "Pesticide",
    "stock": 52,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-49",
        "user": "Farmer 520",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-13"
      }
    ]
  },
  {
    "id": "agri-seed-050",
    "name": "AgriBot Premium Chili Seeds",
    "price": 461,
    "originalPrice": 542,
    "description": "High-quality agribot premium chili seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=50",
      "https://loremflickr.com/800/800/farming,seeds?lock=150"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds 1/4 inch deep in trays kept in a warm location (80°F/27°C).",
      "Transplant seedlings when they have 4-6 true leaves.",
      "Harden off seedlings for a week before moving them to full sun."
    ],
    "category": "Seeds",
    "stock": 92,
    "rating": 4.4,
    "reviews": [
      {
        "id": "rev-50",
        "user": "Farmer 708",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-6"
      }
    ]
  },
  {
    "id": "agri-tool-051",
    "name": "AgriBot Advanced Soil pH Meter",
    "price": 350,
    "originalPrice": 400,
    "description": "High-quality agribot advanced soil ph meter designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=51",
      "https://loremflickr.com/800/800/farming,tools?lock=151"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Wipe the metallic probes clean with a dry cloth before use.",
      "Insert the probes vertically into moist soil down to root level (about 4 inches).",
      "Wait 60 seconds for the reading to stabilize before recording the pH."
    ],
    "category": "Tools",
    "stock": 35,
    "rating": 4.3,
    "reviews": [
      {
        "id": "rev-51",
        "user": "Farmer 155",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-6"
      }
    ]
  },
  {
    "id": "agri-fert-052",
    "name": "AgriBot Hybrid Liquid Fertilizer",
    "price": 418,
    "originalPrice": 504,
    "description": "High-quality agribot hybrid liquid fertilizer designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=52",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=152"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 10ml in 5 liters of water in a watering can.",
      "Apply directly to the soil at the base of the plant.",
      "Use weekly during rapid growth phases for immediate nutrient uptake."
    ],
    "category": "Fertilizer",
    "stock": 93,
    "rating": 4.6,
    "reviews": [
      {
        "id": "rev-52",
        "user": "Farmer 310",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-25"
      }
    ]
  },
  {
    "id": "agri-pest-053",
    "name": "AgriBot Natural Mite Control",
    "price": 881,
    "originalPrice": 1222,
    "description": "High-quality agribot natural mite control designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=53",
      "https://loremflickr.com/800/800/farming,pesticide?lock=153"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Dilute 3ml per liter and use a high-pressure sprayer.",
      "Focus heavily on the underside of leaves where spider mites form webs.",
      "Apply twice, spaced exactly 4 days apart, to break the egg-hatching cycle."
    ],
    "category": "Pesticide",
    "stock": 91,
    "rating": 4.7,
    "reviews": [
      {
        "id": "rev-53",
        "user": "Farmer 846",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-24"
      }
    ]
  },
  {
    "id": "agri-seed-054",
    "name": "AgriBot Premium Carrot Seeds",
    "price": 562,
    "originalPrice": 852,
    "description": "High-quality agribot premium carrot seeds designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=54",
      "https://loremflickr.com/800/800/farming,seeds?lock=154"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Sow seeds very shallowly (1/8 inch) directly into deeply tilled, rock-free soil.",
      "Do not let the soil surface dry out until germination (can take up to 21 days).",
      "Thin seedlings strictly to 2 inches apart to allow root expansion."
    ],
    "category": "Seeds",
    "stock": 30,
    "rating": 4.5,
    "reviews": [
      {
        "id": "rev-54",
        "user": "Farmer 59",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-8"
      }
    ]
  },
  {
    "id": "agri-tool-055",
    "name": "AgriBot Premium Pruning Shears",
    "price": 129,
    "originalPrice": 443,
    "description": "High-quality agribot premium pruning shears designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=55",
      "https://loremflickr.com/800/800/farming,tools?lock=155"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Unlock the safety catch and ensure the bypass blades are aligned.",
      "Make cuts at a 45-degree angle, about 1/4 inch above a healthy bud.",
      "Wipe blades with rubbing alcohol between plants to prevent spreading diseases."
    ],
    "category": "Tools",
    "stock": 2,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-55",
        "user": "Farmer 95",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-15"
      }
    ]
  },
  {
    "id": "agri-fert-056",
    "name": "AgriBot Organic NPK Blend",
    "price": 128,
    "originalPrice": 185,
    "description": "High-quality agribot organic npk blend designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=56",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=156"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Apply 50g per plant as a side dressing away from the main stem.",
      "Incorporate lightly into the top 2 inches of soil.",
      "Water immediately so the granular blend begins dissolving."
    ],
    "category": "Fertilizer",
    "stock": 86,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-56",
        "user": "Farmer 32",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-6"
      }
    ]
  },
  {
    "id": "agri-pest-057",
    "name": "AgriBot Bio-Active Neem Oil",
    "price": 114,
    "originalPrice": 226,
    "description": "High-quality agribot bio-active neem oil designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,pesticide?lock=57",
      "https://loremflickr.com/800/800/farming,pesticide?lock=157"
    ],
    "features": [
      "Premium pesticide grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Mix 5ml neem oil and 2ml mild liquid soap in 1 liter of warm water.",
      "Spray thoroughly covering the tops and bottoms of leaves.",
      "Apply late in the evening to prevent sunburn and avoid harming bees."
    ],
    "category": "Pesticide",
    "stock": 48,
    "rating": 4.8,
    "reviews": [
      {
        "id": "rev-57",
        "user": "Farmer 140",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-20"
      }
    ]
  },
  {
    "id": "agri-seed-058",
    "name": "AgriBot Premium Tomato Seeds F1",
    "price": 809,
    "originalPrice": 916,
    "description": "High-quality agribot premium tomato seeds f1 designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,seeds?lock=58",
      "https://loremflickr.com/800/800/farming,seeds?lock=158"
    ],
    "features": [
      "Premium seeds grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Start seeds indoors in seedling trays 6 weeks before the last frost.",
      "Plant seeds 1/4 inch deep in sterile seed-starting mix.",
      "Keep soil at 75°F (24°C) for optimal germination within 5-7 days."
    ],
    "category": "Seeds",
    "stock": 71,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-58",
        "user": "Farmer 209",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-25"
      }
    ]
  },
  {
    "id": "agri-tool-059",
    "name": "AgriBot Premium Garden Gloves",
    "price": 195,
    "originalPrice": 344,
    "description": "High-quality agribot premium garden gloves designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,tools?lock=59",
      "https://loremflickr.com/800/800/farming,tools?lock=159"
    ],
    "features": [
      "Premium tools grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Pull gloves snugly over hands before handling thorny plants or harsh fertilizers.",
      "The nitrile-coated palms provide grip even when wet.",
      "Hand wash with mild soap and air dry; do not put in a washing machine."
    ],
    "category": "Tools",
    "stock": 2,
    "rating": 5,
    "reviews": [
      {
        "id": "rev-59",
        "user": "Farmer 21",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-10"
      }
    ]
  },
  {
    "id": "agri-fert-060",
    "name": "AgriBot Organic Vermicompost",
    "price": 451,
    "originalPrice": 669,
    "description": "High-quality agribot organic vermicompost designed for Indian farmers. Provides excellent results and improves overall farm yield.",
    "images": [
      "https://loremflickr.com/800/800/agriculture,fertilizer?lock=60",
      "https://loremflickr.com/800/800/farming,fertilizer?lock=160"
    ],
    "features": [
      "Premium fertilizer grade",
      "Tested for high efficiency",
      "Trusted by farmers nationwide",
      "Easy to store and use"
    ],
    "usageInstructions": [
      "Add 200g per pot or sprinkle around the drip line of trees.",
      "Mix gently into the topsoil to preserve beneficial microbes.",
      "Excellent for retaining moisture and suppressing soil-borne diseases."
    ],
    "category": "Fertilizer",
    "stock": 1,
    "rating": 4.9,
    "reviews": [
      {
        "id": "rev-60",
        "user": "Farmer 32",
        "rating": 5,
        "comment": "Great product, very helpful for my crops.",
        "date": "2026-05-26"
      }
    ]
  }
];
