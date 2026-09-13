import { useState } from "react";
import StarRating from "./StarRating.jsx";

export default function ReviewForm({ onSubmit, submitting, error }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [localError, setLocalError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating < 1) {
      setLocalError("Please add your name, a star rating, and a short review.");
      return;
    }
    setLocalError("");
    onSubmit({ name, rating, comment }, () => {
      setName("");
      setRating(0);
      setComment("");
    });
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a review</h3>

      <label className="review-form__field">
        Your rating
        <StarRating value={rating} size={24} onChange={setRating} />
      </label>

      <label className="review-form__field">
        Your name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya M."
          maxLength={60}
        />
      </label>

      <label className="review-form__field">
        Your review
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of the taste, packaging, delivery?"
          rows={4}
          maxLength={800}
        />
        <span className="review-form__char-count">{comment.length}/800</span>
      </label>

      {(localError || error) && <p className="review-form__error">{localError || error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
