import StarRating from "./StarRating.jsx";

export default function RatingSummary({ averageRating, reviewCount, ratingBreakdown }) {
  const breakdown = ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const max = Math.max(1, ...Object.values(breakdown));

  return (
    <div className="rating-summary">
      <div className="rating-summary__headline">
        <div className="rating-summary__score">{averageRating?.toFixed?.(1) ?? "0.0"}</div>
        <div>
          <StarRating value={averageRating || 0} />
          <div className="rating-summary__count">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </div>
        </div>
      </div>

      <div className="rating-summary__bars">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = breakdown[star] || 0;
          const pct = (count / max) * 100;
          return (
            <div className="rating-summary__row" key={star}>
              <span>{star}★</span>
              <div className="rating-summary__track">
                <div className="rating-summary__fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="rating-summary__row-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
