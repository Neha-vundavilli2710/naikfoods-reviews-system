import { useEffect, useState } from "react";
import { getProducts } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-message">Loading products…</p>;
  if (error) return <p className="status-message status-message--error">{error}</p>;
  if (products.length === 0) {
    return <p className="status-message">No products found. Run the seed script to add sample data.</p>;
  }

  return (
    <div>
      <h1>Products</h1>
      <p className="page-subtitle">
        Prototype: real reviews &amp; ratings, backed by a MongoDB + Express API.
      </p>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard product={p} key={p._id} />
        ))}
      </div>
    </div>
  );
}
