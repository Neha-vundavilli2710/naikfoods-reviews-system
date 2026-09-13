import StarRating from "./StarRating.jsx";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReviewList({ reviews, sort, onSortChange }) {
  return (
    <div className="review-list">
      <div className="review-list__header">
        <h3>Customer reviews</h3>
        <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
        </select>
      </div>

      {reviews.length === 0 && (
        <p className="review-list__empty">
          No reviews yet for this product. Be the first to share your experience.
        </p>
      )}

      {reviews.map((r) => (
        <div className="review-list__item" key={r._id}>
          <div className="review-list__item-top">
            <strong>{r.name}</strong>
            <span className="review-list__date">{formatDate(r.createdAt)}</span>
          </div>
          <StarRating value={r.rating} size={15} />
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
