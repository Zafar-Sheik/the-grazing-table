export const CONTACT = {
  whatsappDisplay: "066 233 2019",
  whatsappIntl: "27662332019",
  instagram: "the_grazing_table_zn",
  instagramUrl: "https://instagram.com/the_grazing_table_zn",
};

export const OFFERINGS = [
  "Charcuterie Cups",
  "Grazing Boxes",
  "Grazing Tables",
  "Mini Desserts",
];

export type CupItem = { name: string; upgrade?: number; color: string };
export type CupGroup = {
  key: string;
  title: string;
  choose: number;
  items: CupItem[];
};
export type CupKind = {
  key: "signature" | "sweet";
  name: string;
  tagline: string;
  price: number;
  count: number;
  groups: CupGroup[];
};

export const CUPS: CupKind[] = [
  {
    key: "signature",
    name: "Signature Cup",
    tagline: "Nine hand-picked bites of cheese, charcuterie and crunch.",
    price: 90,
    count: 9,
    groups: [
      {
        key: "cheese",
        title: "Cheese",
        choose: 2,
        items: [
          { name: "Gouda cubes", color: "#f2c94c" },
          { name: "Cheddar cubes", color: "#e8a33d" },
          { name: "Feta blocks", color: "#f7f3e8" },
          { name: "Brie cheese", upgrade: 5, color: "#f3e6c4" },
        ],
      },
      {
        key: "premium",
        title: "Premium Meat",
        choose: 1,
        items: [
          { name: "Smoked beef slices", color: "#8c3b2e" },
          { name: "Dry wors", upgrade: 5, color: "#5e2a1f" },
          { name: "Biltong (shredded)", color: "#6b3324" },
          { name: "Pastrami", color: "#b0473c" },
        ],
      },
      {
        key: "classic",
        title: "Classic Meat",
        choose: 1,
        items: [
          { name: "Salami rounds", color: "#c0504d" },
          { name: "Smoked chicken", color: "#d9a07a" },
          { name: "Vienna slices", color: "#d97a5f" },
          { name: "Chicken sausage slices", color: "#e0a588" },
          { name: "Cocktail sausages", color: "#c8674b" },
        ],
      },
      {
        key: "fresh",
        title: "Fresh & Crunch",
        choose: 4,
        items: [
          { name: "Grapes", color: "#7b2d4a" },
          { name: "Olives", color: "#4a5a2c" },
          { name: "Mini breadsticks", color: "#d8b27a" },
          { name: "Crackers", color: "#e2c08d" },
          { name: "Cucumber", color: "#8db35e" },
          { name: "Baby tomatoes", color: "#d6452f" },
          { name: "Gherkins", color: "#6d7f34" },
        ],
      },
      {
        key: "savoury",
        title: "Savoury",
        choose: 1,
        items: [
          { name: "Popcorn", color: "#fbe7b0" },
          { name: "Salted nuts", color: "#c79a5b" },
          { name: "Spicy nuts", color: "#b8652f" },
          { name: "Pretzels", color: "#a5662e" },
          { name: "Choc-wrapped sweets", color: "#6b4226" },
        ],
      },
    ],
  },
  {
    key: "sweet",
    name: "Sweet Treat Cup",
    tagline: "Eight little indulgences, layered for the sweet tooth.",
    price: 85,
    count: 8,
    groups: [
      {
        key: "premium",
        title: "Premium Treats",
        choose: 2,
        items: [
          { name: "Chocolate bars", color: "#5b3420" },
          { name: "Brownie bites", color: "#4a2a1a" },
          { name: "Waffle bites", color: "#d9a95b" },
          { name: "Fudge squares", color: "#c99158" },
          { name: "Mini doughnuts", color: "#f0b6b0" },
        ],
      },
      {
        key: "fillers",
        title: "Fillers",
        choose: 3,
        items: [
          { name: "Plain popcorn", color: "#fbe7b0" },
          { name: "Mini marshmallows", color: "#fbe3ea" },
          { name: "Pretzels", color: "#a5662e" },
          { name: "Chips", color: "#efc35a" },
        ],
      },
      {
        key: "classic",
        title: "Classic Sweets",
        choose: 3,
        items: [
          { name: "Gummy sweets", color: "#e0526b" },
          { name: "Marshmallow twists", color: "#f4a6c0" },
          { name: "Caramel popcorn", color: "#d48a33" },
          { name: "Chocolate coated peanuts", color: "#6b4226" },
          { name: "Biscuits (mini)", color: "#d8b27a" },
        ],
      },
    ],
  },
];

export const MIN_CUPS = 20;

export const EXTRAS = [
  { key: "cheese", name: "Extra cheese", price: 40 },
  { key: "meat", name: "Extra premium meat", price: 50 },
  { key: "dip", name: "Extra dip", price: 25 },
] as const;

export type Box = {
  key: string;
  name: string;
  pax: string;
  price: number;
  includes: string[];
  note?: string;
  choices?: { label: string; options: string[] }[];
  upgrades?: { name: string; price: number }[];
};

export const BOXES: Box[] = [
  {
    key: "small",
    name: "Small Graze Box",
    pax: "2–3 pax",
    price: 350,
    includes: [
      "2 cheeses",
      "1 classic meat",
      "Fresh fruit (grapes, strawberries)",
      "Crackers",
      "Olives",
      "Baby tomatoes",
      "Nuts",
      "Dip",
      "Honey sachet",
    ],
    note: "Date nights & picnics for two",
    choices: [
      { label: "Cheese", options: ["Cheddar", "Gouda", "Feta"] },
      { label: "Meat", options: ["Salami", "Cocktail sausages"] },
    ],
  },
  {
    key: "medium",
    name: "Medium Graze Box",
    pax: "4–5 pax",
    price: 550,
    includes: [
      "2 cheeses",
      "2 meats (1 classic + 1 premium)",
      "Fresh fruit",
      "Crackers",
      "Breadsticks",
      "Olives",
      "Cucumber",
      "Baby tomatoes",
      "Nuts",
      "Pretzels",
      "2 dips",
      "Honey",
    ],
    note: "Gifting & small celebrations",
    upgrades: [
      { name: "Brie", price: 20 },
      { name: "Smoked beef", price: 25 },
    ],
  },
  {
    key: "large",
    name: "Large Graze Box",
    pax: "6–8 pax",
    price: 850,
    includes: [
      "3 cheeses",
      "3 meats (2 classic + 1 premium)",
      "Fresh fruit medley",
      "Crackers",
      "Breadsticks",
      "Olives",
      "Gherkins",
      "Baby tomatoes",
      "Cucumber",
      "Nuts",
      "Popcorn",
      "2 dips",
      "Honey",
      "Chocolate",
    ],
    note: "A showstopper for family gatherings & events",
  },
];

export const VEG_BOXES = [
  { key: "small", name: "Small Veg Box", pax: "2–3 pax", price: 300 },
  { key: "medium", name: "Medium Veg Box", pax: "4–5 pax", price: 500 },
  { key: "large", name: "Large Veg Box", pax: "6–8 pax", price: 750 },
];

export const VEG_INCLUDES = [
  "Extra cheese",
  "Falafel",
  "Hummus",
  "Extra fruit",
  "Extra crunch",
];

export const DESSERTS = [
  { name: "Custard & Jelly", price: 285 },
  { name: "Peppermint Tart", price: 360 },
  { name: "Malva Pudding", price: 300 },
  { name: "Tiramisu", price: 400 },
  { name: "Chocolate Mousse", price: 365 },
  { name: "Cheesecake", price: 375 },
  { name: "Oreo Delight", price: 360 },
  { name: "Classic Trifle", price: 385 },
  { name: "Biscoff Dessert", price: 395 },
];

export const PARTY_PACKAGES = [
  {
    key: "p50",
    name: "Option 1",
    cups: 50,
    price: 1500,
    note: "Perfect for parties and gatherings",
  },
  {
    key: "p100",
    name: "Option 2",
    cups: 100,
    price: 2500,
    note: "A showstopper for events",
  },
];

export const ACRYLIC = [
  { key: "dozen", name: "Acrylic cup upgrade — per dozen", price: 60 },
  { key: "50", name: "Acrylic cup upgrade — per 50", price: 150 },
  { key: "100", name: "Acrylic cup upgrade — per 100", price: 280 },
  { key: "spoon", name: "Acrylic dessert spoons", price: 1, unit: "each" },
];

export const POLICY = [
  {
    title: "Orders",
    points: [
      "Minimum order is 20 cups (applies to all cup orders)",
      "Orders require 48–72 hours notice — weekend orders, please book early",
      "Final guest count & customisations confirmed 24 hours before",
      "Customisable cups available — quoted accordingly",
      "Only 3 extras available: cheese R40, meat R50, dip R25",
    ],
  },
  {
    title: "Times & Collection",
    points: [
      "Collection only — no delivery available",
      "Collection slots: Mon–Sat 08:00 – 17:00",
      "Sunday by arrangement",
      "Late collection may affect freshness — we are not liable thereafter",
      "Please collect on time to ensure best quality",
    ],
  },
  {
    title: "Desserts",
    points: [
      "Desserts sold by the dozen (12 units per order)",
      "48 hours notice required for all dessert orders",
      "Custom dessert requests & flavours quoted accordingly",
      "No mixed dozens unless stated — pricing per dozen as per menu",
    ],
  },
  {
    title: "Payments",
    points: [
      "50% non-refundable deposit secures your order",
      "Balance due 24 hours before collection",
      "Payment via EFT or cash — proof of payment required",
      "No order is confirmed until deposit is received",
      "Cancellations less than 24 hours forfeit deposit; no refunds once preparation has started",
    ],
  },
];

export const rand = (n: number) =>
  "R" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
