const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review");

// Recalculate and persist a product's aggregate rating fields.
// Called after any review is created or deleted so the product
// document always reflects the current state of its reviews.
async function recalculateProductRating(productId) {
  const reviews = await Review.find({ product: productId });

  const reviewCount = reviews.length;
  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  reviews.forEach((r) => {
    sum += r.rating;
    ratingBreakdown[r.rating] = (ratingBreakdown[r.rating] || 0) + 1;
  });

  const averageRating = reviewCount > 0 ? Number((sum / reviewCount).toFixed(2)) : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating,
    reviewCount,
    ratingBreakdown,
  });
}

// GET /api/products/:slug/reviews?sort=newest|highest|lowest&page=1&limit=10
router.get("/:slug/reviews", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });

    let sortOption = { createdAt: -1 };
    if (req.query.sort === "highest") sortOption = { rating: -1, createdAt: -1 };
    if (req.query.sort === "lowest") sortOption = { rating: 1, createdAt: -1 };

    // Pagination: defaults keep the old "return everything" behaviour usable
    // for small demo datasets, but a real catalog with hundreds of reviews
    // per product needs bounded page sizes.
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ product: product._id }).sort(sortOption).skip(skip).limit(limit),
      Review.countDocuments({ product: product._id }),
    ]);

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
});

// POST /api/products/:slug/reviews  { name, rating, comment }
router.post("/:slug/reviews", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "A review comment is required" });
    }
    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = await Review.create({
      product: product._id,
      name: name.trim(),
      rating: numericRating,
      comment: comment.trim(),
    });

    await recalculateProductRating(product._id);
    const updatedProduct = await Product.findById(product._id);

    res.status(201).json({ review, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
});

module.exports = router;
