const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: String },
    image: { type: String },
    description: { type: String },
    // Denormalized rating fields, kept in sync whenever a review is
    // created / updated / deleted. This avoids recalculating an
    // aggregate on every single product-list page load.
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    ratingBreakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
