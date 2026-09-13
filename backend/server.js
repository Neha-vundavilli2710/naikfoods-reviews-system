require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const productRoutes = require("./routes/products");
const reviewRoutes = require("./routes/reviews");

const app = express();

// In production, set FRONTEND_URL to your deployed frontend origin
// (e.g. https://naikfoods-reviews.netlify.app). Falling back to "*" only
// when it's unset keeps local development friction-free.
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "naikfoods-reviews-backend" });
});

app.use("/api/products", productRoutes);
app.use("/api/products", reviewRoutes); // adds the nested /:slug/reviews endpoints

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/naikfoods_reviews";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
