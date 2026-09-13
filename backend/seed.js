// Seeds the database with a handful of real Naik Foods products
// (name, category, price, weight taken from naikfoods.co.in/in)
// plus a few sample reviews, so the prototype can be demoed
// against realistic data instead of "Lorem ipsum" placeholders.
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Review = require("./models/Review");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/naikfoods_reviews";

const products = [
  {
    name: "Beetroot Chips",
    slug: "beetroot-chips",
    category: "Snacks and Namkeen",
    price: 70,
    weight: "150g",
    image: "https://res.cloudinary.com/dskzfipt3/image/upload/v1780038991/medusa/1780038989592-IMG_3870.JPG.jpeg.jpg",
    description: "Crispy beetroot chips, a nutritious and colourful snack.",
  },
  {
    name: "Cheeseling",
    slug: "cheeseling",
    category: "Snacks and Namkeen",
    price: 110,
    weight: "200g",
    image: "https://res.cloudinary.com/dskzfipt3/image/upload/v1779968324/medusa/1779968322289-IMG_3854.JPG.jpeg.jpg",
    description: "Cheesy, crispy snack-time favourite.",
  },
  {
    name: "Ambadi Bhajiche Lonche",
    slug: "ambadi-bhajiche-lonche",
    category: "Pickles & Condiments",
    price: 190,
    weight: "250g",
    image: "https://res.cloudinary.com/dskzfipt3/image/upload/v1780057106/medusa/1780057104457-pomelli_photoshoot_image_1_1_0529%20%285%29.png.jpg",
    description: "Traditional, tangy Maharashtrian pickle delight.",
  },
  {
    name: "Prawns Pickle (Kolambi Lonche)",
    slug: "kolambi-lonche",
    category: "Pickles & Condiments",
    price: 280,
    weight: "250g",
    image: "https://res.cloudinary.com/dskzfipt3/image/upload/v1780121990/medusa/1780121988900-pomelli_photoshoot_image_1_1_0529%20%287%29.png.jpg",
    description: "Authentic, spicy coastal Konkan-style prawns pickle.",
  },
  {
    name: "Aaswad Mitha Paan",
    slug: "aaswad-mitha-paan",
    category: "Mukhvas & Digestives",
    price: 85,
    weight: "100g",
    image: "https://res.cloudinary.com/dskzfipt3/image/upload/v1781328014/medusa/1781328012514-pomelli_photoshoot_image_1_1_0612%20%2815%29.png.jpg",
    description: "Classic sweet paan flavour in a convenient mouth-freshening blend.",
  },
  {
    name: "Multi Millet Noodles",
    slug: "multi-millet-noodles",
    category: "Dry/Instant Grocery",
    price: 100,
    weight: "180g",
    image: "https://res.cloudinary.com/dskzfipt3/image/upload/v1781327380/medusa/1781327380348-pomelli_photoshoot_image_1_1_0612%20%2821%29.png.jpg",
    description: "Millet-based noodles, a healthier instant-food alternative.",
  },
];

const sampleReviews = {
  "beetroot-chips": [
    { name: "Ananya R.", rating: 5, comment: "Crunchy and not too oily. My kids love these!" },
    { name: "Vikram S.", rating: 4, comment: "Great taste, wish the pack was a bit bigger for the price." },
  ],
  "cheeseling": [
    { name: "Priya M.", rating: 5, comment: "Perfect evening snack, cheesy flavour is spot on." },
  ],
  "ambadi-bhajiche-lonche": [
    { name: "Suresh N.", rating: 4, comment: "Tastes just like homemade pickle. A bit too tangy for my taste though." },
    { name: "Kavita J.", rating: 5, comment: "Reminds me of my grandmother's recipe. Excellent!" },
  ],
  "kolambi-lonche": [
    { name: "Rohan D.", rating: 5, comment: "Authentic Konkan flavour, packed with prawns." },
  ],
  "aaswad-mitha-paan": [],
  "multi-millet-noodles": [
    { name: "Meera T.", rating: 3, comment: "Healthy option but takes a bit of getting used to the taste." },
  ],
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected. Seeding...");

  await Review.deleteMany({});
  await Product.deleteMany({});

  for (const p of products) {
    const created = await Product.create(p);
    const reviews = sampleReviews[p.slug] || [];
    let sum = 0;
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const r of reviews) {
      await Review.create({ ...r, product: created._id });
      sum += r.rating;
      breakdown[r.rating]++;
    }

    created.reviewCount = reviews.length;
    created.averageRating = reviews.length ? Number((sum / reviews.length).toFixed(2)) : 0;
    created.ratingBreakdown = breakdown;
    await created.save();
  }

  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
