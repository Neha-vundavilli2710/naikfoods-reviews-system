import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-card__rating">
          <StarRating value={product.averageRating} size={14} />
          <span>({product.reviewCount})</span>
        </div>
        <div className="product-card__price">
          ₹{product.price}
          {product.weight ? ` · ${product.weight}` : ""}
        </div>
      </div>
    </Link>
  );
}
