const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getProduct(slug) {
  const res = await fetch(`${API_URL}/products/${slug}`);
  if (!res.ok) {
    const err = new Error(res.status === 404 ? "Product not found (404)" : "Failed to load product");
    err.notFound = res.status === 404;
    throw err;
  }
  return res.json();
}

export async function getReviews(slug, { sort = "newest", page = 1, limit = 10 } = {}) {
  const res = await fetch(`${API_URL}/products/${slug}/reviews?sort=${sort}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load reviews");
  return res.json(); // { reviews, pagination }
}

export async function postReview(slug, review) {
  const res = await fetch(`${API_URL}/products/${slug}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit review");
  return data;
}
